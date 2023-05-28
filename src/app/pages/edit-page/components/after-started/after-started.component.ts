import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import {ChangeScoreTeam} from "../../../../shared/types/forms/СhangeScore";
import {Subject} from "rxjs";

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
export class AfterStartedComponent implements OnInit, AfterViewInit{

  @Input('game') public game!: GameAllInfo
  @Output('changeStatusEvent') public changeStatusEvent: EventEmitter<keyof typeof OGameStatus> = new EventEmitter<keyof typeof OGameStatus>()
  protected teamsScoresForm!: FormGroup<TeamsScoresGroup>
  protected toChange: ChangeScoreTeam[] = []
  private cancel: Subject<any> = new Subject<any>()

  @ViewChildren('teamRef') private teamRef!: ElementRef[]
  @ViewChildren('sumRef') private sumRef!: ElementRef[]

  protected readonly GameExercises = GameExercises;
  protected readonly OGameType = OGameType;

  constructor(
    private _fb: FormBuilder,
    private _destroy: DestroyService,
  ) { }

  ngOnInit(): void {
    this.createScoresForm()

  }

  ngAfterViewInit() {
    let max = 0
    this.teamRef.forEach(e => max = Math.max(max, e.nativeElement.getBoundingClientRect().width))
    this.teamRef.forEach(e => e.nativeElement.style.width = max + 'px')
    this.sumRef.forEach(e => e.nativeElement.style.left = max + 'px')
    // this.sumRef.forEach(e=>
    //   e.nativeElement.style.left = this.teamRef.nativeElement.getBoundingClientRect().width + 'px');
    // console.log(this.teamRef.nativeElement.getBoundingClientRect().width)
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

    for (let i = 0; i < GameExercises.getCountExercises(this.game.gameType); i++) {
      teamGroup.controls.scores.push(this.createScoreGroup(team, i));
    }

    return teamGroup
  }

  private createScoreGroup(team: Team, i: number): FormGroup<ScoreGroup> {
    let scoreGroup = this._fb.group<ScoreGroup>({
      score: new FormControl<string>(Converters.convertResponse(team.scores[i], this.game.gameType, true), {
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

            scoreGroup.controls.score.setValue(Converters.convertResponse(team.scores[i], this.game.gameType,true))

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

  protected cancelUpdate() {
    this.cancel.next(1)
  }
}
