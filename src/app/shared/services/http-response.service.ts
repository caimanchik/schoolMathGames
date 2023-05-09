import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService{

  constructor(
    private _httpClient: HttpClient,
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
    })
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
}
