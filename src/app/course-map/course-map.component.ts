import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData, CourseId } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  isHandset$: Observable<boolean>;
  lastHole = 0;

  constructor(
    private readonly route: ActivatedRoute,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  onHoleCliked(meta: HoleMetaData) {
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.map.panTo(meta.data.path);
      }
    }).unsubscribe();
  }

  onHoleMapCliked(meta: HoleMetaData) {
    this.lastHole = meta.hole - 1;
    this.isHandset$
    .subscribe(handset => {
      if (!handset) {
        this.table.notifyHole(meta);
      }
    }).unsubscribe();
  }

  get courseId() {
    return this.route.snapshot.paramMap.get('courseId');
  }
}
