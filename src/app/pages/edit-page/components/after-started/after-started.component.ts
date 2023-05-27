import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameAllInfo} from "../../../../shared/types/Game";
import {OGameStatus} from "../../../../shared/types/GameStatus";
import {DestroyService} from "../../../../shared/services/destroy.service";
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {leave} from "../../../../shared/animations/leave";

@Component({
  selector: 'app-after-started',
  templateUrl: './after-started.component.html',
  styleUrls: ['./after-started.component.scss'],
  providers: [
    DestroyService
  ],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ]),
    trigger('leave', [
      transition(':leave', useAnimation(leave))
    ])
  ]
})
export class AfterStartedComponent implements OnInit {

  @Input('game') public game!: GameAllInfo
  @Output('changeStatusEvent') public changeStatusEvent: EventEmitter<keyof typeof OGameStatus> = new EventEmitter<keyof typeof OGameStatus>()

  constructor() { }

  ngOnInit(): void {
  }

}
