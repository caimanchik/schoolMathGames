import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePageComponent } from './create-page.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '', component: CreatePageComponent
  }
]

@NgModule({
  declarations: [
    CreatePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CreatePageModule { }
