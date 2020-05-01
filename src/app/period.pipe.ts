import { Pipe, PipeTransform } from '@angular/core';
import { Period } from './models';

@Pipe({
  name: 'period'
})
export class PeriodPipe implements PipeTransform {

  transform(period: Period): string {
    try {
      const from = (new Date(period.from))
        .toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
      if (period.from === period.to) {
        return from;
      }
      const to = (new Date(period.to))
        .toLocaleDateString(undefined, {day: 'numeric'});
      return `${from} - ${to}`;
    } catch {
      const from = (new Date(period.from)).toLocaleDateString();
      if (period.from === period.to) {
        return from;
      }
      const to = (new Date(period.to)).toLocaleDateString();
      return `${from} - ${to}`;
    }
  }
}
