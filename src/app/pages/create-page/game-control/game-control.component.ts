import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: GameControlComponent
    }
  ]
})
export class GameControlComponent implements OnInit, ControlValueAccessor {

  protected checked: number = 0

  onChange = (checked: any) => {}
  onTouched = () => {}
  touched = false

  switchCheck(i: number) {
    if (!this.touched)
    {
      this.onTouched()
      this.touched = true
    }

    if (this.checked !== i) {
      this.checked = i
      this.onChange(this.checked)
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  writeValue(i: number) {
    this.checked = i
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  constructor() { }

  ngOnInit(): void {
  }

}
