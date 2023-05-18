import { Component, OnInit } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import {appear} from "../../../../shared/animations/appear";
import {LoginService} from "../../../../shared/services/login.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', useAnimation(appear))
    ])
  ]
})
export class SidebarComponent implements OnInit {

  constructor(
    protected login: LoginService
  ) { }

  ngOnInit(): void {
  }

}
