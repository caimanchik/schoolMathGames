import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public error$: Subject<string> = new Subject<string>()

  constructor() { }

  public createError(error: string): void {
    this.error$.next(error)
  }
}
