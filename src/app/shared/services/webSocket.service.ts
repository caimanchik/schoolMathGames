import {Injectable} from "@angular/core";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {Observable, retry} from "rxjs";


@Injectable()
export class WebSocketService<T> {
  private _socket$!: WebSocketSubject<T> | undefined;
  public messages$!: Observable<T>

  constructor(
    private _url: string
  ) {
    this.connect()
  }

  public connect(reconnect: boolean = false) {
    if (!this._socket$ || this._socket$.closed) {
      this._socket$ = webSocket<T>({
        url: this._url,
        closeObserver: {
          next: () => {
            this._socket$ = undefined;
            this.connect(true)
          }
        }
      })

      this.messages$ = this._socket$.pipe(
        reconnect ? this.reconnect : o => o
      )
    }
  }

  private reconnect(o: Observable<T>): Observable<T> {
    return o.pipe(retry({delay: 5000}))
  }

  public sendMessage(message: T) {
    if (this._socket$)
      this._socket$.next(message)
  }

  public close() {
    if (this._socket$)
      this._socket$.complete()
  }
}
