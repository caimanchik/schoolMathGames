import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService{

  private _url: string = '';

  constructor(
    private _httpClient: HttpClient,
  ) {

  }

  public Get<TGet>(
    uri: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<TGet> {
    return this._httpClient.get<TGet>(this._url + uri, {
      params,
      headers,
    })
  }

  public Post<TPost>(
    uri: string,
    data: TPost,
    params: HttpParams,
    headers: HttpHeaders
  ): Observable<TPost> {
    return this._httpClient.post<TPost>(this._url + uri, data, {
      params,
      headers
    })
  }
}
