import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';

import {TeeSymbol, GoalSymbol, MandoSymbol, TeeIcon, GoalIcon} from '../Symbols';
import { CourseService, HoleInfo } from '../course.service';
import {HoleNumber} from '../models';

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
  }
  holeLineOptions = {
    strokeColor: 'gray',
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
  teeOptions = {
    draggable: false,
    icon: TeeIcon,
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
  get holeName() {
    return this.hole?.holeNumber;
  }
  get par() {
    return this.hole?.par;
  }
  get description() {
    return this.hole?.description;
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
    this.hole = this.holes[index];
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
