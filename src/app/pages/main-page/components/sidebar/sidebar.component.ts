import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {LoginService} from "../../../../shared/services/login.service";
import {DestroyService} from "../../../../shared/services/destroy.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [DestroyService],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class SidebarComponent implements OnInit {

  constructor(
    protected login: LoginService,
    private _destroy: DestroyService
  ) { }

  ngOnInit(): void {
    this.login.isLogged$
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(v => {
        if (!v)
          this.login.checkAuthorization()
            .pipe(this._destroy.TakeUntilDestroy)
            .subscribe()
      })
  }

}
