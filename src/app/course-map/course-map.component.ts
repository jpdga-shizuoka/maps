import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { isHandset, Observable } from '../ng-utilities';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit {

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

}
