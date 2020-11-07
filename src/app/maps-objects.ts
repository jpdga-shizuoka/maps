import { HoleData } from './models';

export type LatLng = google.maps.LatLng;
export type Line = LatLng[];
export type Area = LatLng[];

export interface MarkerInfo {
  title: string;
  position: LatLng;
}

export interface MapsObjects {
  backLines: Line[];
  frontLines: Line[];
  safeAreas: Area[];
  obAreas: Area[];
  obLines: Area[];
  hazardAreas: Area[];
  backTees: MarkerInfo[];
  frontTees: MarkerInfo[];
  dropZones: MarkerInfo[];
  mandos: MarkerInfo[];
}

export function LoadMapsObjects(target: MapsObjects, holes: HoleData[]) {
  const backLines: Line[] = [];
  const frontLines: Line[] = [];
  const safeAreas: Area[] = [];
  const obAreas: Area[] = [];
  const obLines: Line[] = [];
  const hazardAreas: Area[] = [];
  const mandos: MarkerInfo[] = [];
  const dropZones: MarkerInfo[] = [];
  const backTees: MarkerInfo[] = [];
  const frontTees: MarkerInfo[] = [];

  holes.forEach(hole => {

    if (hole.back) {
      const path: LatLng[] = [];
      hole.back.path.forEach(point => path.push(new google.maps.LatLng(point)));
      backLines.push(path);
    }
    if (hole.front) {
      const path: LatLng[] = [];
      hole.front.path.forEach(point => path.push(new google.maps.LatLng(point)));
      frontLines.push(path);
    }

    hole.safeAreas?.forEach(area => {
      const safeArea: LatLng[] = [];
      area.forEach(point => safeArea.push(new google.maps.LatLng(point)));
      safeAreas.push(safeArea);
    });

    hole.obAreas?.forEach(area => {
      const obArea: LatLng[] = [];
      area.forEach(point => obArea.push(new google.maps.LatLng(point)));
      obAreas.push(obArea);
    });

    hole.obLines?.forEach(line => {
      const obLine: LatLng[] = [];
      line.forEach(point => obLine.push(new google.maps.LatLng(point)));
      obLines.push(obLine);
    });

    hole.hazardAreas?.forEach(area => {
      const hazardArea: LatLng[] = [];
      area.forEach(point => hazardArea.push(new google.maps.LatLng(point)));
      hazardAreas.push(hazardArea);
    });

    hole.mandos?.forEach(mando => mandos.push({
      title: hole.number.toString(),
      position: new google.maps.LatLng(mando)
    }));

    hole.dropzones?.forEach(dz => dropZones.push({
      title: hole.number.toString(),
      position: new google.maps.LatLng(dz)
    }));

    if (hole.back) {
      const tee = hole.back.path[0];
      backTees.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(tee)
      });
    }
    if (hole.front) {
      const tee = hole.front.path[0];
      frontTees.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(tee)
      });
    }
  });

  Object.assign(target, {
    backLines,
    frontLines,
    safeAreas,
    obAreas,
    obLines,
    hazardAreas,
    mandos,
    dropZones,
    backTees,
    frontTees,
  });
}
