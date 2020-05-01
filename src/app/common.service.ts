import { Injectable } from '@angular/core';

export type LengthUnit = 'meter' | 'foot';
export const METER = 'meter' as LengthUnit;
export const FOOT = 'foot' as LengthUnit;
export const ONE_FOOT = 3.28084;

export type Language = 'global' | 'local';
export const GLOBAL = 'global' as Language;
export const LOCAL = 'local' as Language;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  lengthUnit = METER;
  language = LOCAL;

  length(value: number, unit?: LengthUnit): string {
    const lengthUnit = unit || this.lengthUnit;
    return  lengthUnit === FOOT
      ? Math.round(value * ONE_FOOT) + 'feet'
      : Math.round(value) + 'm';
  }
}
