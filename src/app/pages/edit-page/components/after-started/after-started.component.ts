import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild,
  ViewChildren
} from '@angular/core';
import {GameAllInfo} from "../../../../shared/types/Game";
import {OGameStatus} from "../../../../shared/types/GameStatus";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {leave} from "../../../../shared/animations/leave";
import {GameExercises} from "../../../../shared/functions/GameExercises";
import {OGameType} from "../../../../shared/types/GameType";
import {Converters} from "../../../../shared/functions/Converters";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ScoreGroup, TeamGroup, TeamsScoresGroup} from "../../../../shared/types/forms/ScoresGroup";
import {Team} from "../../../../shared/types/Team";
import {ChangeScoreGame, ChangeScoreTeam} from "../../../../shared/types/forms/СhangeScore";
import {Subject, take} from "rxjs";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {GamesService} from "../../../../shared/services/games.service";
import {designations} from "../../../../shared/types/Designations";
import {ErrorService} from "../../../../shared/services/error.service";

@Component({
  selector: 'app-after-started',
  templateUrl: './after-started.component.html',
  styleUrls: ['./after-started.component.scss'],
  providers: [
    DestroyService
  ],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('leave', [
      transition(':leave', useAnimation(leave))
    ])
  ]
})
export class AfterStartedComponent implements OnInit{

  @Input('game') public game!: GameAllInfo
  @Output('changeStatusEvent') public changeStatusEvent: EventEmitter<keyof typeof OGameStatus> = new EventEmitter<keyof typeof OGameStatus>()
  @Output('deleteEvent') deleteEvent: EventEmitter<any> = new EventEmitter<any>()

  protected teamsScoresForm!: FormGroup<TeamsScoresGroup>
  protected toChange: ChangeScoreTeam[] = []
  protected desis: any[] = []

  private cancel: Subject<any> = new Subject<any>()
  private interval!: NodeJS.Timer
  private isTeamsChecked = false

  @ViewChildren('teamRef') private teamRef!: ElementRef[]
  @ViewChildren('sumRef') private sumRef!: ElementRef[]
  @ViewChildren('sumHeader') private sumHeaderRef!: ElementRef[]
  @ViewChild('results') private resultsRef!: ElementRef

  protected readonly GameExercises = GameExercises;
  protected readonly OGameType = OGameType;

  constructor(
    private _fb: FormBuilder,
    private _destroy: DestroyService,
    private _confirmer: ConfirmService,
    private _gamesService: GamesService,
    private _error: ErrorService
  ) { }

  ngOnInit(): void {
    this.createScoresForm()
    this.remakeInterval()
    this.checkTeamsView()

    window.addEventListener('orientationchange', () => {
      this.isTeamsChecked = false
      this.checkTeamsView()
    })

    for (let k of Object.keys(designations[this.game.type]))
      // @ts-ignore
      this.desis.push([k, designations[this.game.type][k]])
  }

  private remakeInterval() {
    if (this.game.status == 1)
      this.interval = setInterval(() => {
        this.game.time -= 1
      }, 1000)
    else
      clearInterval(this.interval)
  }

  private checkTeamsView() {
    if (this.isTeamsChecked)
      return
    this.isTeamsChecked = true
    setTimeout(() => {
      let maxWidth = 0
      this.teamRef.forEach(e => maxWidth = Math.max(maxWidth, e.nativeElement.getBoundingClientRect().width))
      this.teamRef.forEach(e => e.nativeElement.style.width = maxWidth + 'px')
      this.sumRef.forEach(e => e.nativeElement.style.left = maxWidth + 'px')
      const height = window.innerHeight|| document.documentElement.clientHeight||
        document.body.clientHeight;
      const top = this.resultsRef.nativeElement.getBoundingClientRect().top;

      this.resultsRef.nativeElement.style.maxHeight = (height - top) + 'px';
    }, 100)
  }

  protected getTeamsGroups() {
    return this.teamsScoresForm.controls.teams.controls
  }

  private createScoresForm() {
    this.teamsScoresForm = this._fb.group<TeamsScoresGroup>({
      teams: this._fb.array<FormGroup<TeamGroup>>([])
    })

    this.game.teams
      .forEach(team => this.teamsScoresForm.controls.teams.push(this.createTeamGroup(team)))
  }

  private createTeamGroup(team: Team): FormGroup<TeamGroup> {
    let teamGroup = this._fb.group<TeamGroup>({
      scores: this._fb.array<FormGroup<ScoreGroup>>([])
    })

    for (let i = 0; i < GameExercises.getCountExercises(this.game.type); i++) {
      teamGroup.controls.scores.push(this.createScoreGroup(team, i));
    }

    return teamGroup
  }

  private createScoreGroup(team: Team, i: number): FormGroup<ScoreGroup> {
    let scoreGroup = this._fb.group<ScoreGroup>({
      score: new FormControl<string>(
        Converters.convertResponse(team.scores[i], this.game.type, true),
        // disabled: this.game.status != 1 && this.game.status != 2,
        {
        nonNullable: true
      })
    })

    this.changeSubscribe(scoreGroup, team, i)

    return scoreGroup
  }

  private changeSubscribe(scoreGroup: FormGroup<ScoreGroup>, team: Team, i: number) {
    let subChange = scoreGroup.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(value => {
        this.valueChange(scoreGroup, team, i, value.score ?? '')

        let cancelSub = this.cancel
          .pipe(this._destroy.takeUntilDestroy)
          .subscribe(() => {
            subChange.unsubscribe()
            cancelSub.unsubscribe()

            let index = this.toChange.findIndex(e => e.teamId == team.teamId && e.exercise == i)

            if (index != -1)
              this.toChange.splice(index, 1)

            scoreGroup.controls.score.setValue(Converters.convertResponse(team.scores[i], this.game.type,true))

            setTimeout(() => {
              this.changeSubscribe(scoreGroup, team, i)
            }, 1000)
          })
      })
  }

  private valueChange(scoreGroup: FormGroup<ScoreGroup>, team: Team, i: number, value: string) {
    if (scoreGroup.invalid)
      return

    let change: ChangeScoreTeam = {
      teamId: team.teamId,
      exercise: i,
      value: value ?? ''
    }

    let index = this.toChange.findIndex(e => e.teamId == team.teamId && e.exercise == i)

    if (index != -1)
      this.toChange.splice(index, 1)

    this.toChange.push(change)
  }

  protected updateScores() {
    let gameScores: ChangeScoreGame = {
      gameId: this.game.id,
      gameType: this.game.type,
      changeScores: this.toChange.map(e => ({
        teamId: e.teamId,
        exercise: e.exercise,
        value: Converters.convertToDb(e.value.toString(), this.game.type)
      }))
    }
    this._gamesService.changeScores(gameScores)
      .pipe(take(1))
      .subscribe()

    this.toChange = []
  }

  protected cancelUpdate() {
    this.cancel.next(1)
  }

  protected changeStatus(status: keyof typeof OGameStatus, message: string) {
    this._confirmer.createConfirm(message)
      .subscribe(result => {
        if (!result)
          return

        this.changeStatusEvent.emit(status)
      })
  }

  protected deleteGame() {
    this._confirmer.createConfirm('Удалить игру?')
      .subscribe(result => {
        if (!result)
          return

        this.deleteEvent.emit(1)
      })
  }

  protected checkStatus(event: MouseEvent, control: FormControl<string>) {
    if (this.game.status != 1 && this.game.status != 2) {
      // @ts-ignore
      event.target.blur()
      this._error.createError('Для редактирования поменяйте статус игры')
    }
  }

  protected focus(i: number, j: number) {
    this.teamRef.forEach((e, ind) => {
      if (ind - 1 == i) {
        e.nativeElement.classList.add('active')
      }
    })

    this.sumHeaderRef.forEach((e, ind) => {
      if (ind == j) {
        e.nativeElement.classList.add('active')
      }
    })
  }

  protected blur(i: number, j: number) {
    this.teamRef.forEach((e, ind) => {
      if (ind - 1 == i) {
        e.nativeElement.classList.remove('active')
      }
    })

    this.sumHeaderRef.forEach((e, ind) => {
      if (ind == j) {
        e.nativeElement.classList.remove('active')
      }
    })
  }
}
