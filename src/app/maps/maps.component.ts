import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';

type LatLng = google.maps.LatLng;

var HOLES = [
  {//1
    path: [
      {lat: 34.788555, lng: 137.322537},
      {lat: 34.788025, lng: 137.323176}
    ],
    mandos: [
      {
        position: {lat: 34.788277, lng: 137.322977},
        rotation: 0
      }
    ]
  },
  {//2
    path: [
      {lat: 34.788591, lng: 137.322796},
      {lat: 34.787709, lng: 137.323771}
    ]
  },
  {//3
    path: [
      {lat: 34.787493, lng: 137.324089},
      {lat: 34.786938, lng: 137.324051}
    ]
  },
  {//4
    path: [
      {lat: 34.786967, lng: 137.323976},
      {lat: 34.787344, lng: 137.323571},
      {lat: 34.787588, lng: 137.323005}
    ]
  },
  {//5
    path: [
      {lat: 34.787712, lng: 137.322743},
      {lat: 34.788241, lng: 137.321816},
      {lat: 34.788378, lng: 137.321842},
      {lat: 34.788515, lng: 137.322194}
    ]
  },
  {//6
    path: [
      {lat: 34.789608, lng: 137.322875},
      {lat: 34.789001, lng: 137.323815}
    ]
  },
  {//7
    path: [
      {lat: 34.788747, lng: 137.322985},
      {lat: 34.787547, lng: 137.324958}
    ]
  },
  {//8
    path: [
      {lat: 34.787078, lng: 137.325119},
      {lat: 34.787449, lng: 137.324232},
    ],
    obAreas: [
      [
        {lat: 34.787045, lng: 137.325180},
        {lat: 34.787420, lng: 137.325180},
        {lat: 34.787417, lng: 137.324092},
        {lat: 34.787033, lng: 137.324083},
      ]
    ]
  },
  {
    path: [
      {lat: 34.786926, lng: 137.324258},
      {lat: 34.786999, lng: 137.324695},
      {lat: 34.786876, lng: 137.325091}
    ]
  }
];

const teeSymbol = {path: google.maps.SymbolPath.CIRCLE};
const goalSymbol = {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW};
const mandoSybol = {
    path: "M0 0 H 90 V 90 H 0 L 0 0",
    fillColor: '#FF0000',
    fillOpacity: .5,
    anchor: new google.maps.Point(45, 45),
    strokeWeight: 0,
    scale: .25,
    rotation: 45
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  showTee = false;
  showGoal = false;
  width: number;
  height: number;
  center = {lat: 34.787550, lng: 137.323436};
  zoom = 18;
  markerOptions = {
    draggable: false
  };
  holeLineOptions = {
    strokeColor: 'gray',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    icons: [
      {icon: teeSymbol, offset: '0%'},
      {icon: goalSymbol, offset: '100%'}
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
    icon: 'assets/maps/tee.svg',
  };
  goalOptions = {
    draggable: false,
    icon: 'assets/maps/goal.svg',
  };
  mandoOptions = {
    draggable: false,
    icon: mandoSybol,
  };

  markerPositions: google.maps.LatLngLiteral[] = [];
  display?: google.maps.LatLngLiteral;
  holeLines: Array<LatLng[]> = [];
  obAreas: Array<LatLng[]> = [];
  tees: Array<LatLng> = [];
  goals: Array<LatLng> = [];
  mandos: Array<LatLng> = [];

  constructor(
    private ngZone: NgZone,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    HOLES.forEach(hole => {
      const path: LatLng[] = [];
      hole.path.forEach(point => path.push(new google.maps.LatLng(point.lat, point.lng)));
      this.holeLines.push(path);

      const obArea: LatLng[] = [];
      hole.obAreas?.forEach(area => {
        area.forEach(point => obArea.push(new google.maps.LatLng(point.lat, point.lng)));
        this.obAreas.push(obArea);
      });

      hole.mandos?.forEach(mando => this.mandos.push(new google.maps.LatLng(mando.position.lat, mando.position.lng)));
      if (this.showTee) {
        const tee = hole.path[0];
        this.tees.push(new google.maps.LatLng(tee.lat, tee.lng));
      }
      if (this.showGoal) {
        const goal = hole.path[hole.path.length - 1];
        this.goals.push(new google.maps.LatLng(goal.lat, goal.lng));
      }
    })
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }

}
