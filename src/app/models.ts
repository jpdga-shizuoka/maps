
export interface Position {
  lat: number;
  lng: number;
}

export type HoleNumber = number | string;
export type HoleLine = Position[];
export type Area = Position[];
export type ObLine = Position[];

export interface HoleInfo {
  holeNumber: HoleNumber;
  par: number;
  path: HoleLine;
  length?: number;
  description?: string;
  mandos?: Position[];
  safeAreas?: Area[];
  obAreas?: Area[];
  obLines?: ObLine[];
}
