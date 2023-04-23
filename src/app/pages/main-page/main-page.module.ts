import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GamesComponent } from './components/games/games.component';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './main-page.component';



@NgModule({
  declarations: [
    SidebarComponent,
    GamesComponent,
    GameComponent,
    LoginComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainPageModule { }
