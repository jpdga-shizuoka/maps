import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;

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
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.map.panTo(hole.data.path);
      }
    }).unsubscribe();
  }

  onHoleMapCliked(hole: HoleMetaData) {
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.table.notifyHole(hole);
      }
    }).unsubscribe();
  }
}
