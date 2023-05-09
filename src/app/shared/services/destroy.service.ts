import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, takeUntil} from "rxjs";

@Injectable()
export class DestroyService implements OnDestroy {
  private readonly _destroy$: Subject<void> = new Subject<void>()

  public TakeUntilDestroy<T>(origin: Observable<T>): Observable<T> {
    return origin.pipe(takeUntil(this._destroy$))
  }

  ngOnDestroy(): void {
    this._destroy$.next()
    this._destroy$.complete()
  }

}
