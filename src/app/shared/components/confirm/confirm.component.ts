import { Component, OnInit } from '@angular/core';
import {ConfirmService} from "../../services/confirm.service";
import {DestroyService} from "../../services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../animations/appear";
import {leave} from "../../animations/leave";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [DestroyService],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('leave', [
      transition(':leave', useAnimation(leave))
    ])
  ]
})
export class ConfirmComponent implements OnInit {

  protected message: string | null = null

  constructor(
    private confirmer: ConfirmService,
    private _destroy: DestroyService
  ) { }

  ngOnInit(): void {
    this.confirmer.confirmMessages
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe(message => this.message = message)
  }

  confirm(result: boolean) {
    this.message = null
    this.confirmer.confirmResult.next(result)
  }

}
