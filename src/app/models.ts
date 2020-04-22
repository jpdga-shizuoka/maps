
export interface Position {
  lat: number;
  lng: number;
}

export type HoleNumber = number;
export type HoleLine = Position[];
export type Area = Position[];
export type ObLine = Position[];

export interface HoleData {
  path: HoleLine;
  par: number;
  length?: number;
}

export interface HoleInfo {
  holeNumber: HoleNumber;
  back?: HoleData;
  front?: HoleData;
  description?: string;
  mandos?: Position[];
  safeAreas?: Area[];
  obAreas?: Area[];
  obLines?: ObLine[];
}
