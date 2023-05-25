import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DestroyService} from "../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../shared/animations/appear";
import {CreateGame} from "../../shared/types/Game";
import {GamesService} from "../../shared/services/games.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  providers: [
    DestroyService
  ],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class CreatePageComponent implements OnInit {

  createForm!: FormGroup
  protected currentDate: string = `2018-01-10`

  constructor(
    private _fb: FormBuilder,
    private _destroy: DestroyService,
    private _gamesService: GamesService,
    private _router: Router
  ) {
    let nowDate = new Date(Date.now())
    this.currentDate = `${nowDate.getFullYear()}-${(nowDate.getMonth() < 9 ? '0' : '')}${(nowDate.getMonth() + 1)}-${(nowDate.getDate() < 10 ? '0' : '')}${nowDate.getDate()}`

    this.createForm = this._fb.group({
      gameTitle: new FormControl<string>('', {
        validators: [Validators.required]
      }),
      game: 2,
      date: new FormControl<string>(
        this.currentDate,
        {
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
      time: new FormControl(`${nowDate.getHours() < 10 ? '0' : ''}${nowDate.getHours()}:${nowDate.getMinutes() < 10 ? '0' : ''}${nowDate.getMinutes()}`,
        {
        validators: Validators.required
      }),
      timeGame: new FormControl('03:30', {
        validators: Validators.required
      })
    })

    this.createForm.controls['date'].valueChanges
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe((e: string) => this.currentDate = e)
  }

  ngOnInit() {

  }

  createGame() {
    if (this.createForm.invalid) {
      this.createForm.controls['gameTitle'].markAsTouched()
      return
    }

    let game: CreateGame = {
      name: this.createForm.controls['gameTitle'].value,
      gameType: this.codeTime(this.createForm.controls['timeGame'].value),
      start: Date.parse(this.createForm.controls['date'].value + 'T' + this.createForm.controls['time'].value),
      timeGame: this.createForm.controls['timeGame'].value,
    }

    this._gamesService.createGame(game)
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(createdGame => {
        this._router.navigate(['edit', createdGame.id], {
          state: createdGame
        })
      })
  }

  private codeTime(input: string): number {
    let split = input.split(':')
    let hours = parseInt(split[0])
    let minutes = parseInt(split[1])

    return hours * 3600 + minutes * 60
  }
}
