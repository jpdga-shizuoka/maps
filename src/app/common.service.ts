import { Injectable } from '@angular/core';

export type LengthUnit = 'meter' | 'foot';
export const METER = 'meter' as LengthUnit;
export const FOOT = 'foot' as LengthUnit;
export const ONE_FOOT = 3.28084;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  lengthUnit = METER;

  length(value: number, unit?: LengthUnit): string {
    const lengthUnit = unit || this.lengthUnit;
    return  lengthUnit === FOOT
      ? Math.round(value * ONE_FOOT) + 'feet'
      : Math.round(value) + 'm';
  }
}
