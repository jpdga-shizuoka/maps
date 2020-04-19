import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMap, MapInfoWindow, MapMarker, MapPolyline,
} from '@angular/google-maps';

var HOLES = [
  {
    path: [
      {lat: 34.787078, lng: 137.325119},
      {lat: 34.787449, lng: 137.324232},
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
  markerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 18;
  display?: google.maps.LatLngLiteral;
  holes: Array<google.maps.LatLng[]> = [];

  constructor(
    private ngZone: NgZone,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    HOLES.forEach(hole => {
      const path: google.maps.LatLng[] = [];
      hole.path.forEach(point => {
        path.push(new google.maps.LatLng(point.lat, point.lng));
      });
      this.holes.push(path);
    })
  }

  // get path() {
  //   const path: google.maps.LatLng[] = [];
  //   path.push(new google.maps.LatLng(holeCoordinates[0][0], holeCoordinates[0][1]));
  //   path.push(new google.maps.LatLng(holeCoordinates[1][0], holeCoordinates[1][1]));
  //   return path;
  // }

  get holeLineOptions() {
    return {
      // geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    };
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
