import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main-page/main-page.module').then(m => m.MainPageModule)
  },
  {
    path: 'game/:id',
    loadChildren: () => import('./pages/game-page/game-page.module').then(m => m.GamePageModule)
  },
  {
    path: 'create-game',
    loadChildren: () => import('./pages/create-page/create-page.module').then(m => m.CreatePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/edit-page/edit-page.module').then(m => m.EditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**', redirectTo: '/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
