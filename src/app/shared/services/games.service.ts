import { Injectable } from '@angular/core';
import {HttpResponseService} from "./http-response.service";
import {map, Observable} from "rxjs";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {CreateGame, DeleteGame, GameAllInfo, GameMainPage, UpdateGame, UpdateGameStatus} from "../types/Game";
import {CreateTeam, DeleteTeam, Team, UpdateTeam} from "../types/Team";
import {ChangeScoreGame} from "../types/forms/СhangeScore";

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

    return this._http.Get<GameMainPage[]>('api/v1/gameList/', params)
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

  public createGame(game: CreateGame): Observable<GameAllInfo> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<CreateGame, GameAllInfo>('api/v1/createGame', game, new HttpParams(), headers)
  }

  public deleteGame(game: DeleteGame): Observable<any> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<DeleteGame, any>('api/v1/deleteGame', game, new HttpParams(), headers)
  }

  public getGameById(id: number): Observable<GameAllInfo> {
    const params = new HttpParams().set('id', id)

    return this._http.Get<GameAllInfo>('api/v1/game', params)
  }

  public addTeam(team: CreateTeam): Observable<Team> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<CreateTeam, Team>('api/v1/addTeam', team, new HttpParams(), headers)
  }

  public deleteTeam(team: DeleteTeam): Observable<Team> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<DeleteTeam, Team>('api/v1/deleteTeam', team, new HttpParams(), headers)
  }

  public updateTeam(team: UpdateTeam): Observable<Team> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<UpdateTeam, Team>('api/v1/updateTeam', team, new HttpParams(), headers)
  }

  public updateGame(game: UpdateGame): Observable<any> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<UpdateGame, any>('api/v1/updateGameInfo', game, new HttpParams(), headers)
  }

  public updateGameStatus(game: UpdateGameStatus): Observable<GameAllInfo> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<UpdateGameStatus, GameAllInfo>('api/v1/updateGameStatus', game, new HttpParams(), headers)
  }

  public changeScores(scores: ChangeScoreGame): Observable<any> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)

    return this._http.Post<ChangeScoreGame, any>('api/v1/changeScores', scores, new HttpParams(), headers)
  }
}
