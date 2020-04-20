import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';

type LatLng = google.maps.LatLng;

var HOLES = [
  {
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
  }
];

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  width: number;
  height: number;
  center = {lat: 34.787550, lng: 137.323436};
  markerOptions = {
    draggable: false
  };
  holeLineOptions = {
    // geodesic: true,
    strokeColor: '#0000FF',
    strokeOpacity: 1.0,
    strokeWeight: 2
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

  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 18;
  display?: google.maps.LatLngLiteral;
  holeLines: Array<LatLng[]> = [];
  obAreas: Array<LatLng[]> = [];
  tees: Array<LatLng> = [];
  goals: Array<LatLng> = [];

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
      const obArea: LatLng[] = [];
      hole.path.forEach(point => path.push(new google.maps.LatLng(point.lat, point.lng)));
      hole.obAreas?.forEach(area => {
        area.forEach(point => obArea.push(new google.maps.LatLng(point.lat, point.lng)));
        this.obAreas.push(obArea);
      });
      this.holeLines.push(path);

      const tee = hole.path[0];
      this.tees.push(new google.maps.LatLng(tee.lat, tee.lng));

      const goal = hole.path[hole.path.length - 1];
      this.goals.push(new google.maps.LatLng(goal.lat, goal.lng));
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
