import { Injectable } from '@angular/core';
import {Observable, Subject, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  confirmMessages: Subject<string> = new Subject<string>()
  confirmResult: Subject<boolean> = new Subject<boolean>()

  constructor() { }

  createConfirm(message: string): Observable<boolean> {
    this.confirmMessages.next(message)
    return this.confirmResult
      .pipe(take(1))
  }
}
