import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BackToMainComponent} from "./components/back-to-main/back-to-main.component";
import {ErrorComponent} from "./components/error/error.component";
import {StatusDirective} from "./directives/status.directive";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective
  ]
})
export class SharedModule { }
