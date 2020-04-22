import {Position} from './models';

export function holeLength(path: Position[]) {
  let length = 0;
  let top = path[0];
  path.slice(1).forEach(next => {
    length += distance(top, next);
    top = next;
  });
  return length;
}

function distance(p1: Position, p2: Position) {
  const earthRadius = 6378136;

  const dLat = d2r(p2.lat - p1.lat);
  const dLng = d2r(p2.lng - p1.lng);

  const lat1 = d2r(p1.lat);
  const lat2 = d2r(p2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadius * c);
}

function d2r(degrees) {
  return degrees * Math.PI / 180;
}
