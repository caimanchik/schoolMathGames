import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {LoginService} from "../../../../shared/services/login.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginForm} from "../../../../shared/types/forms/LoginForm";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {Router} from "@angular/router";

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

  @ViewChild('buttonElement') button!: ElementRef

  protected isVisiblePass: boolean = false
  protected loginForm!: FormGroup<LoginForm>

  constructor(
    private _login: LoginService,
    private _destroy: DestroyService,
    private _router: Router
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
  }

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.controls.login.markAsTouched()
      this.loginForm.controls.password.markAsTouched()
      return
    }

    this.button.nativeElement.classList.add('loading')

    this._login.login({
      username: this.loginForm.controls.login.value,
      password: this.loginForm.controls.password.value
    })
      .pipe(this._destroy.takeUntilDestroy)
      .subscribe( {
        next: () => this._router.navigate(['']),
        error: () => {
          this.button.nativeElement.classList.remove('loading')
        }
      })
  }
}
