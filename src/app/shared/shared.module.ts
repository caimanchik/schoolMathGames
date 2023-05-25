import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BackToMainComponent} from "./components/back-to-main/back-to-main.component";
import {ErrorComponent} from "./components/error/error.component";
import {StatusDirective} from "./directives/status.directive";
import {RouterLink} from "@angular/router";
import { ConfirmComponent } from './components/confirm/confirm.component';



@NgModule({
  declarations: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective,
    ConfirmComponent
  ]
})
export class SharedModule { }
