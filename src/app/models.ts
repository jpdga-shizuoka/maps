
export interface Position {
  lat: number;
  lng: number;
}

export type TeeType = 'front' | 'back';
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
  dropzones?: Position[];
  mandos?: Position[];
  safeAreas?: Area[];
  obAreas?: Area[];
  obLines?: ObLine[];
}

export interface HoleMetaData {
  hole: number;
  teeType: TeeType;
  description: string;
  data: HoleData;
}
