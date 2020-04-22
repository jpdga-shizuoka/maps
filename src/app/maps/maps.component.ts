import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';
import { ResizedEvent } from 'angular-resize-event';

import {
  TeeSymbol, GoalSymbol, MandoSymbol, TeeMarkers, GoalIcon, FrontMarkers
} from '../Symbols';
import { CourseService, HoleInfo } from '../course.service';
import {HoleNumber, Position} from '../models';

type LatLng = google.maps.LatLng;
type TeeType = 'front' | 'back';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

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
  backLineOptions = {
    strokeColor: 'white',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    icons: [
      {icon: TeeSymbol, offset: '0%'},
      {icon: GoalSymbol, offset: '100%'}
    ],
  };
  frontLineOptions = {
    strokeColor: '#a9f5bc',
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
  backLines: google.maps.LatLng[][] = [];
  frontLines: google.maps.LatLng[][] = [];
  obAreas: google.maps.LatLng[][] = [];
  backTees: google.maps.LatLng[] = [];
  frontTees: google.maps.LatLng[] = [];
  goals: google.maps.LatLng[] = [];
  mandos: google.maps.LatLng[] = [];
  //
  //  for info window
  //
  hole: HoleInfo;
  length: number;
  private _teetype: TeeType;
  get holeName() {
    return this.hole?.holeNumber;
  }
  get par() {
    return this.hole?.par;
  }
  get description() {
    return this.hole?.description;
  }
  get teeType() {
    return this._teetype === 'front' ? 'フロント•ティー' : 'バック•ティー';
  }

  private getHoleNumberFromIndex(index: number, type: TeeType) {
    let hole: HoleInfo;
    let position = 0;

    for (let i = 0; i < this.holes.length; i++) {
      hole = this.holes[i];
      if (hole[type]) {
        position++;
      }
      if (index < position) {
        break;
      }
    }
    return hole.holeNumber;
  }

  private getMarker(index: number, type: TeeType) {
    const holeNumber = this.getHoleNumberFromIndex(index, type);
    return (type === 'front' ? FrontMarkers : TeeMarkers)[holeNumber - 1];
  }

  backTeeOptions(index: number) {
    return {
      draggable: false,
      icon: this.getMarker(index, 'back'),
    };
  }
  frontTeeOptions(index: number) {
    return {
      draggable: false,
      icon: this.getMarker(index, 'front'),
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

  private getHoleFromIndex(index: number, type: TeeType) {
    const holeNumber = this.getHoleNumberFromIndex(index, type);
    return this.holes.find(hole => hole.holeNumber === holeNumber);
  }

  private openHoleDescription(teemarker: MapMarker, index: number, type: TeeType) {
    const hole = this.getHoleFromIndex(index, type);
    this.hole = hole;
    this._teetype = type;
    this.length = holeLength(type === 'front' ? hole.front : hole.back);
    this.infoWindow.open(teemarker);
  }

  onBackTeeClicked(teemarker: MapMarker, index: number) {
    this.openHoleDescription(teemarker, index, 'back');
  }

  onFrontTeeClicked(teemarker: MapMarker, index: number) {
    this.openHoleDescription(teemarker, index, 'front');
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  private loadCourse() {
    if (this.holes) {
      return;
    }
    this.courseService.getCourse().subscribe(holes => {
      this.holes = holes;
      holes.forEach(hole => {

        if (hole.back) {
          const path: LatLng[] = [];
          hole.back.forEach(point => path.push(new google.maps.LatLng(point)));
          this.backLines.push(path);
        }
        if (hole.front) {
          const path: LatLng[] = [];
          hole.front.forEach(point => path.push(new google.maps.LatLng(point)));
          this.frontLines.push(path);
        }

        const obArea: LatLng[] = [];
        hole.obAreas?.forEach(area => {
          area.forEach(point => obArea.push(new google.maps.LatLng(point)));
          this.obAreas.push(obArea);
        });

        hole.mandos?.forEach(mando => this.mandos.push(new google.maps.LatLng(mando)));
        if (hole.back) {
          const tee = hole.back[0];
          this.backTees.push(new google.maps.LatLng(tee));
        }
        if (hole.front) {
          const tee = hole.front[0];
          this.frontTees.push(new google.maps.LatLng(tee));
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
