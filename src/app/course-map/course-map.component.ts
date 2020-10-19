import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSelectChange } from '@angular/material/select';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData, CourseId, CourseItem, EventData, EventId } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';
import { RemoteService } from '../remote-service';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit, OnDestroy {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  @ViewChild("courseTab") courseTab: MatTabGroup;
  readonly isHandset$: Observable<boolean>;
  eventId: EventId;
  courseId: CourseId;
  lastHole: number;
  courses: CourseItem[];
  event?: EventData;
  private ssRoute: Subscription;
  get isPrinting() {return this.printService.isPrinting;}

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly remote: RemoteService,
    private readonly printService: PrintService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  ngOnInit() {
    this.ssRoute
      = this.route.params.subscribe(params => this.loadEvent(params));
  }

  ngOnDestroy() {
    this.ssRoute?.unsubscribe();
  }

  onHoleCliked(meta: HoleMetaData) {
    this.isHandset$.pipe(take(1)).subscribe(handset => {
      if (!handset) {
        this.map.fitBounds(meta.data.path);
      }
      else if (meta.longPressed){
        this.lastHole = meta.hole;
        this.courseTab.selectedIndex = 1;
      }
    });
  }

  onHoleMapCliked(meta: HoleMetaData) {
    this.lastHole = meta.hole;
    this.isHandset$.pipe(take(1)).subscribe(handset => {
      if (!handset) {
        this.table.notifyHole(meta);
      }
    });
  }

  onSelectionChange(event: MatSelectChange) {
    this.router.navigate(['course', this.eventId,  event.value]);
  }

  onPrint() {
    this.printService
      .printDocument('caddiebook', this.eventId, this.courseId);
  }

  private loadEvent(params: Params) {
    // this.lastHole = 1;
    this.courses = [];
    this.eventId = params.eventId;
    this.remote.getEvent(this.eventId).subscribe(
      event => this.event = event,
      err => console.log(err),
      () => this.loadCourses(params.courseId)
    );
  }

  private loadCourses(courseId: CourseId) {
    this.courseId = courseId;
    this.remote.getCourses(this.event.courses)
      .subscribe(course => this.courses.push(course));
  }
}
