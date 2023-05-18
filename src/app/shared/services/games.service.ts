import { Injectable } from '@angular/core';
import {HttpResponseService} from "./http-response.service";
import {map, Observable} from "rxjs";
import {GameMainPage} from "../types/GameMainPage";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(
    private _http: HttpResponseService
  ) {
  }

  public getGames(history: boolean = false): Observable<GameMainPage[]> {
    let params: HttpParams = new HttpParams().append('history', history)

    return this._http.Get<GameMainPage[]>('games/', params)
      .pipe(
        map(r =>
          r.map(game => ({
          ...game,
          start: typeof game.start === 'string' ? new Date(+game.start) : game.start
        }))
            .sort((a, b) => +b.start - +a.start)
        )
      )
  }

  // public getGames1(history: boolean = false): Observable<GameMainPage[]> {
  //
  //   return of([
  //     {
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 0,
  //       start: new Date(),
  //       status: 4
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 1,
  //       start: new Date(),
  //       status: 1
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 2,
  //       start: new Date(),
  //       status: 2
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 1,
  //       start: new Date(),
  //       status: 3
  //     },
  //     {
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 0,
  //       start: new Date(),
  //       status: 4
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 1,
  //       start: new Date(),
  //       status: 1
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 2,
  //       start: new Date(),
  //       status: 2
  //     },{
  //       id: 32,
  //       name: 'Первый тур чемпионата лицея №130 по Математическим Абакам',
  //       gameType: 1,
  //       start: new Date(),
  //       status: 3
  //     },
  //   ])
  // }

  // public createGame(): Observable<>
}
