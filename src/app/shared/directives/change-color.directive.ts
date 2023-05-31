import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appChangeColor]'
})
export class ChangeColorDirective implements OnInit{

  @Input('appChangeColor') value!: string

  constructor(
    private element: ElementRef
  ) { }

  ngOnInit(): void {
    let value = parseInt(this.value)
    this.element.nativeElement.style.backgroundColor =
      value <= 0
        ? '#DA0303'
        : value > 0
          ? '#68A153'
          : 'white'
  }

}
