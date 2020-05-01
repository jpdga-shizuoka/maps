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

export function path2bounds(path: Position[]): google.maps.LatLngBounds {
  const sw = {lat: 90, lng: 180};
  const ne = {lat: -90, lng: -180};
  path.forEach(p => {
    sw.lat = Math.min(sw.lat, p.lat);
    sw.lng = Math.min(sw.lng, p.lng);
    ne.lat = Math.max(ne.lat, p.lat);
    ne.lng = Math.max(ne.lng, p.lng);
  });
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(sw), new google.maps.LatLng(ne));
}

export function position2geolink(p?: Position): string {
  if (!p) {
    return;
  }
  return getUrlForGeolocation() + `${p.lat},${p.lng}`;
}

function getUrlForGeolocation(): string {
  return isAppleDevice()
    ? 'http://maps.apple.com/?ll='
    : 'https://maps.google.com/?q=';
}

function isAppleDevice(): boolean {
  return /iPhone|iPad|Macintosh/.test(window.navigator.userAgent);
}
