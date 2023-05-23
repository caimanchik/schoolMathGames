import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService{

  constructor(
    private _httpClient: HttpClient,
    private _error: ErrorService
  ) {

  }

  public Get<TGet>(
    uri: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<TGet> {
    return this._httpClient.get<TGet>(environment.url + uri, {
      params,
      headers,
      observe: 'body'
    })
      .pipe(
        catchError(e => this.handleError.bind(this)(e))
      )
  }

  public Post<TPost, TGet>(
    uri: string,
    data: TPost,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<TGet> {
    return this._httpClient.post<TGet>(environment.url + uri, data, {
      params,
      headers
    })
      .pipe(
        catchError(e => this.handleError.bind(this)(e))
      )
  }

  public Put<TPut>(
    uri: string,
    data: TPut,
    params: HttpParams,
    headers: HttpHeaders
  ): Observable<TPut> {
    return this._httpClient.put<TPut>(environment.url + uri, data, {
      params,
      headers
    })
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error.non_field_errors[0] == 'Unable to log in with provided credentials.') {
      this._error.createError('Неверный логин или пароль')
      // return throwError(() => new Error('Ошибка запроса'))
    } else if (error.status !== 401)
      this._error.createError('Неизвестная ошибка')
    // else
    //   this._error.createError('Неизвестная ошибка')

    return throwError(() => new Error('Ошибка запроса'))
  }
}
