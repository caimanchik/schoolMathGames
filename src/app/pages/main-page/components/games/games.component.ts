import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {GamesService} from "../../../../shared/services/games.service";
import {delay} from "rxjs";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {GameMainPage} from "../../../../shared/types/Game";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class GamesComponent implements OnInit {

  protected isHistory: boolean = false
  protected games!: GameMainPage[]

  constructor(
    private _router: Router,
    private _gamesService: GamesService
  ) { }

  ngOnInit(): void {
    this.isHistory = this._router.url.endsWith('history')
    this._gamesService.getGames(this.isHistory)
      // .pipe(delay(2000))
      .subscribe((games: GameMainPage[]) => {
        this.games = games
    })
  }

}
