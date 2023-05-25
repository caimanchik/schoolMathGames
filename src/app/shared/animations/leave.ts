import {animate, animation, style} from "@angular/animations";

export const leave = animation([
  style({opacity: 1}),
  animate('.3s ease', style({ opacity: 0 }))
])
