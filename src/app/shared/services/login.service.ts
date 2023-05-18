import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {HttpResponseService} from "./http-response.service";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService{

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private _http: HttpResponseService
  ) { }

  public login(login: string, password: string): Observable<{accessToken: string}> {
    let params = new HttpParams().append('login', login).append('password', password)
    return this._http.Get<{accessToken: string}>('login', params)
      .pipe(
        tap((token) => {
          this.isLogged$.next(true)
          localStorage.setItem('token', token.accessToken)
        })
      )
  }
  
  public checkAuthorization(): Observable<{ validToken: boolean }> {
    let params = new HttpParams().append('accessToken', localStorage.getItem('token') ?? '')
    return this._http.Get<{ validToken: boolean }>('isValidToken', params)
      .pipe(
        tap(token => {
          if (token.validToken)
            this.isLogged$.next(true)
        })
      )
  }
}
