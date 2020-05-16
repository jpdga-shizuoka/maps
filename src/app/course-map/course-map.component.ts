import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSelectChange } from '@angular/material/select';
import { take } from 'rxjs/operators';
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
export class CourseMapComponent implements OnInit {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  readonly eventId: EventId;
  readonly courseId: CourseId;
  readonly isHandset$: Observable<boolean>;
  lastHole = 0;
  courses: CourseItem[] = [];
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
    this.remote.getCourses(this.event.courses)
      .subscribe(course => this.courses.push(course));
  }

  ngOnInit() {
    this.remote.getEvent(this.eventId).subscribe(
      event => this.event = event,
      err => console.log(err),
      () => this.loadCourses()
    );
  }

  onHoleCliked(meta: HoleMetaData) {
    this.isHandset$.pipe(take(1)).subscribe(handset => {
      if (!handset) {
        this.map.panTo(meta.data.path);
      }
    });
  }

  onHoleMapCliked(meta: HoleMetaData) {
    this.lastHole = meta.hole - 1;
    this.isHandset$.pipe(take(1)).subscribe(handset => {
      if (!handset) {
        this.table.notifyHole(meta);
      }
    });
  }

  onSelectionChange(event: MatSelectChange) {
    this.router.navigate(['reload'])
      .then(() => this.router.navigate(['course', this.eventId,  event.value]));
  }
}
