import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData, CourseId, CourseItem, EventData, EventId } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';
import { CourseService } from '../course-service';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit, OnDestroy {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  readonly eventId: EventId;
  readonly courseId: CourseId;
  readonly isHandset$: Observable<boolean>;
  lastHole = 0;
  courses: CourseItem[] = [];
  ssEvent?: Subscription;
  ssCourses?: Subscription;
  event?: EventData;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly remote: CourseService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.courseId = route.snapshot.paramMap.get('courseId');
    this.eventId = route.snapshot.paramMap.get('eventId');
    this.isHandset$ = isHandset(breakpointObserver);
  }

  private loadCourses() {
    this.ssCourses = this.remote.getCourses(this.event.courses)
    .subscribe(course => this.courses.push(course));
  }

  ngOnInit() {
    this.ssEvent = this.remote.getEvent(this.eventId)
    .subscribe(
      event => this.event = event,
      err => console.log(err),
      () => this.loadCourses()
    );
  }

  ngOnDestroy() {
    this.ssEvent?.unsubscribe();
    this.ssCourses?.unsubscribe();
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
      relativeTo: this.route
    });
  }
}
