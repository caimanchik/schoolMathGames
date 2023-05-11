import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamePageComponent } from './game-page.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '', component: GamePageComponent
  }
]

@NgModule({
  declarations: [
    GamePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GamePageModule { }
