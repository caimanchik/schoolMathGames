import { Component, OnInit } from '@angular/core';
import {ErrorService} from "../../services/error.service";
import {DestroyService} from "../../services/destroy.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  providers: [DestroyService],
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  protected error: string = ''
  protected visible: boolean = false
  private timeOut!: NodeJS.Timeout

  constructor(
    private _error: ErrorService,
    private _destroy: DestroyService
  ) {
  }

  ngOnInit(): void {
    this._error.error$
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(error => {
        this.error = error
        this.visible = true
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.visible = false
          clearTimeout(this.timeOut)
        }, 3000)
      })
  }

}
