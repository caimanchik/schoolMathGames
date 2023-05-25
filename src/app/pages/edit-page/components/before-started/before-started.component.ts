import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameAllInfo} from "../../../../shared/types/Game";
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
import {Team} from "../../../../shared/types/Team";
import {Router} from "@angular/router";
import {GamesService} from "../../../../shared/services/games.service";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {leave} from "../../../../shared/animations/leave";
import {TeamControl} from "../../../../shared/types/forms/TeamControl";
import {ConfirmService} from "../../../../shared/services/confirm.service";

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
  @Output('startEvent') startEvent: EventEmitter<true> = new EventEmitter<true>()

  protected gameForm!: FormGroup<GameForm>
  protected teamForm!: FormGroup
  protected teams!: Team[]
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

  addTeam(event: any): void {
    if (event.target.classList.contains('loading'))
      return

    event.target.classList.add('loading')

    setTimeout(() => {
      let control = this.teamsControls.at(this.teamsControls.length - 1)
      control.controls.id.setValue(this.counter)
      this.teams.push({
        name: control.controls.name.value,
        id: this.counter,
        sumScore: 1,
        scores: []
      })
      event.target.classList.remove('loading')
      this.teamsControls.push(this.initTeam())
    }, 1000)

    // todo add team with updating id
  }

  removeTeam(i: number, event: any) {
    this._confirmer.createConfirm('Удалить команду?')
      .subscribe(result => {
        if (!result)
          return

        if (event.target.classList.contains('loading'))
          return

        event.target.classList.add('loading');

        const team = this.teams[i]

        this.teamsControls.at(i).disable()

        setTimeout(()=> {


          let controls = this.teamsControls
          for (let j = 0; j < controls.length; j++) {
            if (controls.at(j).controls.id.value == team.id) {
              controls.removeAt(j)
              this.teams.splice(this.teams.findIndex(e => e.id == team.id), 1);
              break
            }
          }
        }, 0)
      })
    //todo delete team
  }

  updateTeam(i: number, event: any): void {
    if (event.target.classList.contains('loading'))
      return

    event.target.classList.add('loading')
    this.teamsControls.at(i).disable()

    //todo check disable

    let team = this.teams[i]

    setTimeout(() => {
      let controls = this.teamsControls

      for (let j = 0; j < controls.length; j++) {
        if (controls.at(j).controls.id.value == team.id) {
          team.name = controls.at(j).controls.name.value
          this.teamsControls.at(i).enable()
          break
        }
      }
    }, 500)

    //todo update team
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

  startGame() {
    this._confirmer.createConfirm('Начать игру?')
      .subscribe(result => {
        if (!result)
          return

        this.startEvent.emit(true)
      })
  }
}
