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

  constructor(
    private readonly route: ActivatedRoute,
    // private readonly sheet: MatBottomSheet,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  onHoleCliked(hole: HoleMetaData) {
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.map.panTo(hole.data.path);
      }
    }).unsubscribe();
  }

  onHoleMapCliked(hole: HoleMetaData) {
    this.isHandset$
    .subscribe(handset => {
      if (!handset) {
        this.table.notifyHole(hole);
      }
    }).unsubscribe();
  }

  get courseId() {
    return this.route.snapshot.paramMap.get('courseId');
  }
}
