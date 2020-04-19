import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

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

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
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
