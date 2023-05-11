import {animate, animation, style} from "@angular/animations";

export const appear = animation([
  style({opacity: 0}),
  animate('.5s ease', style({ opacity: 1 }))
])
