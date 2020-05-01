import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CourseService, EventId, LocationId, EventData, LocationData, CourseData, CourseId
} from '../course-service';
import { position2geolink } from '../map-utilities';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  @Input() eventId: EventId;
  private ssEvent?: Subscription;
  private ssLocation?: Subscription;
  private ssCourses: Subscription[] = [];
  event?: EventData;
  location?: LocationData;
  courses: CourseData[] = [];

  constructor(private readonly remoteService: CourseService) { }

  ngOnInit(): void {
    this.ssEvent = this.remoteService.getEvent(this.eventId)
    .pipe(
      tap(event => this.getLocation(event.location)),
      tap(event => this.getCourses(event.courses))
    ).subscribe(event => this.event = event);
  }

  ngOnDestroy() {
    this.ssEvent?.unsubscribe();
    this.ssLocation?.unsubscribe();
    this.ssCourses.forEach(ss => ss.unsubscribe());
  }

  get geolink() {
    return position2geolink(this.location?.geolocation);
  }

  private getLocation(id: LocationId) {
    this.ssLocation = this.remoteService.getLocation(id)
    .subscribe(location => this.location = location);
  }

  private getCourses(ids: CourseId[]) {
    ids.forEach(id => {
      const ss = this.remoteService.getCourse(id)
      .subscribe(course => this.courses.push(course));
      this.ssCourses.push(ss);
    });
  }
}
