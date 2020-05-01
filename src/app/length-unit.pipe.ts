import { Pipe, PipeTransform } from '@angular/core';
import { CommonService, LengthUnit, METER, FOOT, ONE_FOOT } from './common.service';

@Pipe({
  name: 'lengthUnit'
})
export class LengthUnitPipe implements PipeTransform {

  transform(value: number, unit?: LengthUnit): string {
    const lengthUnit = unit || this.commonService.lengthUnit;
    return  lengthUnit === FOOT
      ? Math.round(value * ONE_FOOT) + 'feet'
      : Math.round(value) + 'm';
  }

  constructor(private readonly commonService: CommonService) { }
}
