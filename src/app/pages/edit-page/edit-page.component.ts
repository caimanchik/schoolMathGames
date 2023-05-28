import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {GameAllInfo} from "../../shared/types/Game";
import {GamesService} from "../../shared/services/games.service";
import {DestroyService} from "../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../shared/animations/appear";
import {
  FormBuilder,
} from "@angular/forms";
import {leave} from "../../shared/animations/leave";
import {take} from "rxjs";
import {OGameStatus} from "../../shared/types/GameStatus";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
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
export class EditPageComponent implements OnInit {

  protected game!: GameAllInfo | null

  constructor(
    private _router: Router,
    private _gamesService: GamesService,
    private _destroy: DestroyService,
    private _fb: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    let game = this._router.getCurrentNavigation()?.extras.state

    if (!!game) {
      this.game = game as GameAllInfo
      return
    }

    this._gamesService.getGameById(parseInt(this._router.url.split('/').reverse()[0]))
      .pipe(
        this._destroy.takeUntilDestroy,
        // delay(2000)
      )
      .subscribe(gameResp => {
        this.game = gameResp
      })
  }

  protected changeGameStatus(status: keyof typeof OGameStatus) {
    let id = this.game?.id ?? 0
    this.game = null

    this._gamesService.updateGameStatus({gameId: id, status: status})
      .pipe(take(1))
      .subscribe(game => {
        setTimeout(() => this.game = game, 300)
      })
  }

  protected deleteGame() {
    this.game = null
  }
}
