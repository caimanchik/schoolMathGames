import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (value < 0)
      return '00:00:00'
    let hours = Math.floor(value / 3600)
    let minutes = Math.floor((value - hours * 3600) / 60)
    let seconds = value - hours * 3600 - minutes * 60

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

}
