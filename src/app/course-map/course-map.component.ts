import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData, CourseId, CourseItem } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit, OnDestroy {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  isHandset$: Observable<boolean>;
  lastHole = 0;
  selectedCourse: CourseId;
  courses?: CourseItem[];
  subscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  ngOnInit() {
    this.selectedCourse = this.courseId;
    // https://angular.io/api/router/NavigationExtras#state
    // https://medium.com/ableneo/how-to-pass-data-between-routed-components-in-angular-2306308d8255
    // https://netbasal.com/set-state-object-when-navigating-in-angular-7-2-b87c5b977bb
    this.subscription = this.route.paramMap.pipe(
      map(() => window.history.state.courses as CourseItem[])
    ).subscribe(courses => this.courses = courses);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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

  onSelectionChange(event: MatSelectChange) {
    this.router.navigate(['./..', event.value], {
      relativeTo: this.route,
      state: {courses: this.courses}
    });
  }

  get courseId() {
    return this.route.snapshot.paramMap.get('courseId');
  }
}
