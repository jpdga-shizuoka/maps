import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';

import {TeeSymbol, GoalSymbol, MandoSymbol, TeeMarkers, GoalIcon} from '../Symbols';
import { CourseService, HoleInfo } from '../course.service';
import {HoleNumber, Position} from '../models';

type LatLng = google.maps.LatLng;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  showTee = true;
  showGoal = false;
  width: number;
  height: number;
  center = {lat: 34.787550, lng: 137.323436};
  zoom = 18;
  mapOptions = {
    maxZoom: 20,
    minZoom: 17,
    mapTypeId: 'satellite',
    disableDefaultUI: true,
    tilt: 0
  }
  holeLineOptions = {
    strokeColor: 'white',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    icons: [
      {icon: TeeSymbol, offset: '0%'},
      {icon: GoalSymbol, offset: '100%'}
    ],
  };
  obAreaOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.3
  };
  goalOptions = {
    draggable: false,
    icon: GoalIcon,
  };
  mandoOptions = {
    draggable: false,
    icon: MandoSymbol,
  };

  holes: HoleInfo[];
  holeLines: google.maps.LatLng[][] = [];
  obAreas: google.maps.LatLng[][] = [];
  tees: google.maps.LatLng[] = [];
  goals: google.maps.LatLng[] = [];
  mandos: google.maps.LatLng[] = [];
  hole: HoleInfo;
  length: number;
  get holeName() {
    return this.hole?.holeNumber;
  }
  get par() {
    return this.hole?.par;
  }
  get description() {
    return this.hole?.description;
  }
  teeMarker(index: number) {
    return TeeMarkers[index];
  }
  teeOptions(index: number) {
    return {
      draggable: false,
      icon: this.teeMarker(index),
    };
  }

  constructor(
    private ngZone: NgZone,
    private el: ElementRef,
    private courseService: CourseService,
  ) { }

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.loadCourse();
  }

  openHoleDescription(teemarker: MapMarker, index: number) {
    const hole = this.holes[index];
    this.hole = hole;
    this.length = holeLength(hole.path);
    this.infoWindow.open(teemarker);
  }

  private loadCourse() {
    if (this.holes) {
      return;
    }
    this.courseService.getCourse().subscribe(holes => {
      this.holes = holes;
      holes.forEach(hole => {
        const path: LatLng[] = [];
        hole.path.forEach(point => path.push(new google.maps.LatLng(point)));
        this.holeLines.push(path);

        const obArea: LatLng[] = [];
        hole.obAreas?.forEach(area => {
          area.forEach(point => obArea.push(new google.maps.LatLng(point)));
          this.obAreas.push(obArea);
        });

        hole.mandos?.forEach(mando => this.mandos.push(new google.maps.LatLng(mando)));
        if (this.showTee) {
          const tee = hole.path[0];
          this.tees.push(new google.maps.LatLng(tee));
        }
        if (this.showGoal) {
          const goal = hole.path[hole.path.length - 1];
          this.goals.push(new google.maps.LatLng(goal));
        }
      })
    }).unsubscribe();
  }
}

function holeLength(path: Position[]) {
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
