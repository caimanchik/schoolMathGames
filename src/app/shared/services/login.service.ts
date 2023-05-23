import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, from, Observable, of, tap} from "rxjs";
import {HttpResponseService} from "./http-response.service";
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {User} from "../types/User";

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private _http: HttpResponseService
  ) { }

  public login(user: User): Observable<{auth_token: string}> {
    return this._http.Post<User, {auth_token: string}>('auth/token/login', user)
      .pipe(
        tap((token) => {
          this.isLogged$.next(true)
          localStorage.setItem('token', token.auth_token)
        })
      )
  }
  
  public checkAuthorization(): Observable<{ validToken: boolean }> {
    let headers = new HttpHeaders().append('Authorization', `Token ${localStorage.getItem('token') ?? ''}`)
    return this._http.Get<{ validToken: boolean }>('api/v1/isValidToken', new HttpParams(), headers)
      .pipe(
        tap(token => {
          if (token.validToken)
            this.isLogged$.next(true)
        }),
        catchError(() => {
          return of({validToken: false})
        })
      )
  }

  public logOut(): void {
    localStorage.removeItem('token')
    this.isLogged$.next(false)
  }
}
