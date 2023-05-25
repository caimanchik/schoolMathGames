import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageComponent } from './edit-page.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BeforeStartedComponent } from './components/before-started/before-started.component';


const routes: Routes = [
  {
    path: '', component: EditPageComponent
  }
]


@NgModule({
  declarations: [
    EditPageComponent,
    BeforeStartedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class EditPageModule { }
