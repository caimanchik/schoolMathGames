import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BackToMainComponent} from "./components/back-to-main/back-to-main.component";
import {ErrorComponent} from "./components/error/error.component";
import {StatusDirective} from "./directives/status.directive";
import {RouterLink} from "@angular/router";
import { ConfirmComponent } from './components/confirm/confirm.component';
import { TimePipe } from './pipes/time.pipe';
import { ChangeColorDirective } from './directives/change-color.directive';



@NgModule({
  declarations: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective,
    ConfirmComponent,
    TimePipe,
    ChangeColorDirective,
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    BackToMainComponent,
    ErrorComponent,
    StatusDirective,
    ConfirmComponent,
    TimePipe,
    ChangeColorDirective,
  ]
})
export class SharedModule { }
