import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameAllInfo, UpdateGame} from "../../../../shared/types/Game";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {GameForm} from "../../../../shared/types/forms/GameForm";
import {Team, UpdateTeam} from "../../../../shared/types/Team";
import {Router} from "@angular/router";
import {GamesService} from "../../../../shared/services/games.service";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {leave} from "../../../../shared/animations/leave";
import {TeamControl} from "../../../../shared/types/forms/TeamControl";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {take} from "rxjs";
import {OGameStatus} from "../../../../shared/types/GameStatus";

@Component({
  selector: 'app-before-started',
  templateUrl: './before-started.component.html',
  styleUrls: ['./before-started.component.scss'],
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
export class BeforeStartedComponent implements OnInit {

  @Input('game') game!: GameAllInfo
  @Output('changeStatusEvent') changeStatusEvent: EventEmitter<keyof typeof OGameStatus> = new EventEmitter<keyof typeof OGameStatus>()
  @Output('deleteEvent') deleteEvent: EventEmitter<true> = new EventEmitter<true>()

  protected gameForm!: FormGroup<GameForm>
  protected teamForm!: FormGroup
  protected teams!: Team[]
  protected disableGameForm = true

  private counter = -1

  constructor(
    private _router: Router,
    private _gamesService: GamesService,
    private _destroy: DestroyService,
    private _fb: FormBuilder,
    private _confirmer: ConfirmService
  ) {
  }

  ngOnInit(): void {
    this.parseGame(this.game)

    this.gameForm.valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(() => {
        this.disableGameForm = false
      })
  }

  get teamsControls() {
    return this.teamForm.controls['teams'] as FormArray<FormGroup<TeamControl>>
  }

  private initTeams(game: GameAllInfo): void {
    this.teamForm = this._fb.group<{teams: FormArray<FormGroup<TeamControl>>}>({
      teams: this._fb.array<FormGroup<TeamControl>>([])
    })

    game.teams.forEach(team => this.teamsControls.push(this.initTeam(team)))

    this.teamsControls.push(this.initTeam())

    this.teams = game.teams
  }

  private initTeam(team?: Team): FormGroup<TeamControl> {
    return this._fb.group<TeamControl>({
      name: new FormControl<string>(team?.name ?? '', {
        nonNullable: true
      }),
      id: new FormControl<number>(team?.id ?? --this.counter, {
        nonNullable: true
      })
    })
  }

  protected addTeam(event: any): void {
    if (event.target.classList.contains('loading'))
      return

    event.target.classList.add('loading')

    let control = this.teamsControls.at(this.teamsControls.length - 1)
    control.disable()

    this._gamesService.addTeam({gameId: this.game.id, name: control.controls.name.value})
      .pipe(take(1))
      .subscribe(team => {
        control.controls.id.setValue(team.id)
        this.teams.push(team)

        event.target.classList.remove('loading')
        control.controls.id.setValue(this.counter)
        control.enable()

        this.teamsControls.push(this.initTeam())
      })
  }

  protected deleteTeam(i: number, event: any) {
    this._confirmer.createConfirm('Удалить команду?')
      .subscribe(result => {
        if (!result)
          return

        if (event.target.classList.contains('loading'))
          return

        event.target.classList.add('loading');

        let control = this.teamsControls.at(i)
        control.disable()

        this._gamesService.deleteTeam({gameId: this.game.id, teamId: control.controls.id.value})
          .pipe(take(1))
          .subscribe(team => {
            let controls = this.teamsControls
            for (let j = 0; j < controls.length; j++) {
              if (controls.at(j).controls.id.value == team.id) {
                controls.removeAt(j)
                this.teams.splice(this.teams.findIndex(e => e.id == team.id), 1);
                break
              }
            }
          })
      })
  }

  protected updateTeam(i: number, event: any): void {
    if (event.target.classList.contains('loading'))
      return

    event.target.classList.add('loading')

    let control = this.teamsControls.at(i)
    control.disable()

    //todo check disable

    let team: UpdateTeam = {
      gameId: this.game.id,
      teamId: control.controls.id.value,
      name: control.controls.name.value
    }

    this._gamesService.updateTeam(team)
      .pipe(take(1))
      .subscribe(team => {
        let teamFront = this.teams.find(e => e.id == team.id)

        if (!teamFront)
          return

        teamFront.name = team.name

        control.enable()
      })
  }

  cancelUpdate(i: number): void {
    let control = this.teamsControls.at(i);
    let team = this.teams.find(e => e.id == control.controls.id.value);

    if (team)
      control.controls.name.setValue(team.name)
  }

  private parseGame(gameResp: GameAllInfo): void {
    const date = new Date(gameResp.start)

    this.gameForm = new FormGroup<GameForm>({
      gameTitle: new FormControl<string>(gameResp.name, {
        validators: [Validators.required],
        nonNullable: true
      }),
      date: new FormControl<string>(this.parseDate(date), {
        nonNullable: true,
        validators: [
          Validators.required,
          (control: AbstractControl): ValidationErrors | null => {
            const s = control.value.toString().split('.').reverse().join('-')
            const v = Date.parse(s)

            if (isNaN(+v))
              return {
                invalidDate: true
              }

            return null
          }
        ]
      }),
      time: new FormControl<string>(this.parseTime(date), {
        nonNullable: true
      }),
      timeGame: new FormControl<string>(this.parseTimeGame(gameResp.timeGame), {
        nonNullable: true
      })
    })

    this.initTeams(gameResp)

    this.game = gameResp
  }

  private parseTimeGame(input: number): string {
    const hours = Math.floor(input / 3600)
    const minutes = Math.floor((input - hours * 3600) / 60)

    return `${(hours < 10 ? '0' : '')}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  }

  private parseDate(input: Date): string {
    return `${input.getFullYear()}-${(input.getMonth() < 9 ? '0' : '')}${(input.getMonth() + 1)}-${(input.getDate() < 10 ? '0' : '')}${input.getDate()}`
  }

  private parseTime(input: Date): string {
    return `${input.getHours() < 10 ? '0' : ''}${input.getHours()}:${input.getMinutes() < 10 ? '0' : ''}${input.getMinutes()}`
  }

  protected startGame() {
    this._confirmer.createConfirm('Начать игру?')
      .subscribe(result => {
        if (!result)
          return

        this.changeStatusEvent.emit(1)
      })
  }

  protected deleteGame() {
    this._confirmer.createConfirm('Удалить игру?')
      .subscribe(result => {
        if (!result)
          return

        this.deleteEvent.emit(true)

        this._gamesService.deleteGame({gameId: this.game.id})
          .pipe(take(1))
          .subscribe(() => this._router.navigate(['']))
      })
  }

  protected updateGame() {
    if (this.gameForm.invalid || this.gameForm.disabled) {
      this.gameForm.markAsTouched()
      return
    }

    this.gameForm.disable()

    let game: UpdateGame = {
      gameId: this.game.id,
      name: this.gameForm.controls.gameTitle.value,
      timeGame: this.codeTime(this.gameForm.controls.timeGame.value),
      start: Date.parse(this.gameForm.controls.date.value + 'T' + this.gameForm.controls.time.value)
    }

    setTimeout(() => this.disableGameForm = true, 10)

    this._gamesService.updateGame(game)
      .subscribe(() => {
        this.game.name = game.name
        this.game.timeGame = game.timeGame
        this.game.start = new Date(game.start)
        this.gameForm.enable()
        setTimeout(() => this.disableGameForm = true, 10)
      })
  }

  private codeTime(input: string): number {
    let split = input.split(':')
    let hours = parseInt(split[0])
    let minutes = parseInt(split[1])

    return hours * 3600 + minutes * 60
  }

  protected resetGame() {
    if (this.gameForm.disabled)
      return

    let date = new Date(this.game.start)
    this.gameForm.controls.gameTitle.setValue(this.game.name)
    this.gameForm.controls.date.setValue(this.parseDate(date))
    this.gameForm.controls.time.setValue(this.parseTime(date))
    this.gameForm.controls.timeGame.setValue(this.parseTimeGame(this.game.timeGame))

    this.gameForm.enable()

    setTimeout(() => {
      this.disableGameForm = true
    }, 10)
  }
}
