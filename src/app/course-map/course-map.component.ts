import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData } from '../models';
import { MapsComponent } from '../maps/maps.component';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit {
  @ViewChild(MapsComponent) map: MapsComponent;

  isHandset$: Observable<boolean>;
  mapsInfo = {
    center: {lat: 34.787550, lng: 137.323436},
    zoom: 18
  };

  constructor(
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  ngOnInit(): void {
  }

  onHoleCliked(hole: HoleMetaData) {
    this.map.panTo(hole.data.path);
  }
}
