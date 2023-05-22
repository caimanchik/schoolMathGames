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

  public Post<TPost>(
    uri: string,
    data: TPost,
    params: HttpParams,
    headers: HttpHeaders
  ): Observable<TPost> {
    return this._httpClient.post<TPost>(environment.url + uri, data, {
      params,
      headers
    })
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
    if (error.status === 401)
      this._error.createError(error.error.error)
    else
      this._error.createError('Неизвестная ошибка')

    return throwError(() => new Error('Ошибка запроса'))
  }
}
