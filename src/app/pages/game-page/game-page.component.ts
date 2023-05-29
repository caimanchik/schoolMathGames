import {Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {GamesService} from "../../shared/services/games.service";
import {Router} from "@angular/router";
import {DestroyService} from "../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../shared/animations/appear";
import {leave} from "../../shared/animations/leave";
import {GameAllInfo} from "../../shared/types/Game";
import {switchMap, timer} from "rxjs";
import {OGameType} from "../../shared/types/GameType";
import {GameExercises} from "../../shared/functions/GameExercises";
import {Converters} from "../../shared/functions/Converters";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
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
export class GamePageComponent implements OnInit{

  protected game!: GameAllInfo
  protected time: string = ''
  @ViewChildren('teamRef') private teamRef!: ElementRef[]
  @ViewChildren('sumRef') private sumRef!: ElementRef[]

  protected readonly OGameType = OGameType;
  protected readonly GameExercises = GameExercises;
  protected readonly Converters = Converters;

  private isTeamsChecked = false
  private interval!: NodeJS.Timer

  constructor(
    private _gamesService: GamesService,
    private _router: Router,
    private _destroy: DestroyService,
  ) { }

  public ngOnInit(): void {
    timer(0, 7000)
      .pipe(
        switchMap(() => {
          return this._gamesService.getGameById(parseInt(this._router.url.split('/').reverse()[0]))
        })
      )
      .pipe(
        this._destroy.takeUntilDestroy,
      )
      .subscribe(gameResp => {
        if (!this.game) {
          this.game = gameResp
          this.checkTeamsView()
          this.remakeInterval()
          return
        }

        this.checkResponse(gameResp)
        this.checkTeamsView()
      })
  }

  private remakeInterval() {
    clearInterval(this.interval)

    if (this.game.status == 1)
      this.interval = setInterval(() => {
        this.game.time -= 1
        }, 1000)
  }

  private checkResponse(game: GameAllInfo) {
    if (this.game.name != game.name)
      this.game.name = game.name

    if (this.game.status != game.status) {
      this.game.status = game.status
      this.game.time = game.time
    }

    this.remakeInterval()
    // if (game.status != 1)
    //   this.game.time = game.time

    game.teams.forEach((team, i) => {
      team.scores.forEach((score, j) => {
        if (this.game.teams[i].scores[j] != score)
          this.game.teams[i].scores[j] = score
      })

      if (this.game.teams[i].sumScore != team.sumScore)
        this.game.teams[i].sumScore = team.sumScore
    })
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
    }, 100)
  }
}
