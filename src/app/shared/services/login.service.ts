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
        tap(() => {
          this.isLogged$.next(true)
        })
      )
  }
}
