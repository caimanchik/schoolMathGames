import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GamesComponent } from './components/games/games.component';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './main-page.component';
import {RouterModule, Routes} from "@angular/router";
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: MainPageComponent, children: [
      {
        path: '', component: GamesComponent
      },
      {
        path: 'history', component: GamesComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'error', component: NotFoundComponent
      }
    ],
  },
]

@NgModule({
  declarations: [
    SidebarComponent,
    GamesComponent,
    GameComponent,
    LoginComponent,
    MainPageComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainPageModule { }
