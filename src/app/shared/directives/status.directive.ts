import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {OGameStatus} from "../types/GameStatus";

@Directive({
  selector: '[statusColor]'
})
export class StatusDirective implements OnInit {

  @Input() statusColor!: keyof typeof OGameStatus

  constructor(
    private e: ElementRef
  ) {
  }

  ngOnInit(): void {
    const cases = {
      0: '#6B6B6B',
      1: '#68A153',
      2: '#BE8632',
      3: '#536EA1',
      4: '#A15353',
    }

    this.e.nativeElement.style.color = cases[this.statusColor as keyof typeof cases]
  }

}
