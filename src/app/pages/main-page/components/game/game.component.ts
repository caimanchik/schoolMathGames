import {Component, Input, OnInit} from '@angular/core';
import {OGameType} from "../../../../shared/types/GameType";
import {OGameStatus} from "../../../../shared/types/GameStatus";
import {LoginService} from "../../../../shared/services/login.service";
import {GameMainPage} from "../../../../shared/types/Game";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() game!: GameMainPage
  protected readonly OGameType = OGameType;
  protected readonly OGameStatus = OGameStatus;

  constructor(
    protected login: LoginService
  ) { }

  ngOnInit(): void {
  }


}
