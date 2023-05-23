import {NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePageComponent } from './create-page.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import { GameControlComponent } from './game-control/game-control.component';
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '', component: CreatePageComponent
  }
]

@NgModule({
  declarations: [
    CreatePageComponent,
    GameControlComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,

  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class CreatePageModule{
}
