import {Position, HoleData} from './models';

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

export class Path2Bounds {
  readonly bounds = {
    sw: {lat: 90, lng: 180},
    ne: {lat: -90, lng: -180}
  };
  addPath(path: Position[]) {
    path.forEach(p => {
      this.bounds.sw.lat = Math.min(this.bounds.sw.lat, p.lat);
      this.bounds.sw.lng = Math.min(this.bounds.sw.lng, p.lng);
      this.bounds.ne.lat = Math.max(this.bounds.ne.lat, p.lat);
      this.bounds.ne.lng = Math.max(this.bounds.ne.lng, p.lng);
    });
  }
}

export class Holes2Bounds extends Path2Bounds {
  readonly center: Position;
  readonly value: google.maps.LatLngBounds;

  constructor(holes: HoleData[]) {
    super();
    holes.forEach(hole => this.addPath(hole.back?.path || hole.front.path));
    this.center = {
      lat: (this.bounds.sw.lat + this.bounds.ne.lat) / 2,
      lng: (this.bounds.sw.lng + this.bounds.ne.lng) / 2
    };
    const sw = new google.maps.LatLng(this.bounds.sw);
    const ne = new google.maps.LatLng(this.bounds.ne);
    this.value = new google.maps.LatLngBounds(sw, ne);
  }
}

export class LatLngBounds extends Path2Bounds {
  constructor(path: Position[]) {
    super();
    this.addPath(path);
  }
  get value() {
    const sw = new google.maps.LatLng(this.bounds.sw);
    const ne = new google.maps.LatLng(this.bounds.ne);
    return new google.maps.LatLngBounds(sw, ne);
  }
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
