import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {LoginService} from "../../../../shared/services/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "../../../../shared/types/LoginForm";
import {DestroyService} from "../../../../shared/services/destroy.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DestroyService],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class LoginComponent implements OnInit {

  protected isVisiblePass: boolean = false
  protected loginForm!: FormGroup<LoginForm>

  constructor(
    private _login: LoginService,
    private _destroy: DestroyService
  ) {
    this.loginForm = new FormGroup<LoginForm>({
      login: new FormControl<string>('', {
        validators: Validators.required,
        nonNullable: true
      }),
      password: new FormControl<string>('', {
        validators: Validators.required,
        nonNullable: true
      })
    })
  }

  ngOnInit(): void {
    // this._login.login('admin', '123456')
    //   .subscribe(e => console.log(e.accessToken))
  }

  login() {
    this._login.login(
      this.loginForm.controls.login.value,
      this.loginForm.controls.password.value
    )
      .pipe(this._destroy.TakeUntilDestroy)
      .subscribe(v => {
        console.log(v.accessToken)
      })
  }
}
