import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  CourseService, EventId, LocationId, EventData, LocationData, CourseData, CourseId
} from '../course-service';
import { position2geolink } from '../map-utilities';
import { CourseItem } from '../models';

class CourseItemExt implements CourseItem {
  readonly id: CourseId;
  readonly title: string;
  constructor(courseData: CourseData) {
    this.id = courseData.id;
    this.title = courseData.title;
  }
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() eventId: EventId;

  private readonly _event: BehaviorSubject<EventData>;
  get event() { return this._event.value; }
  set event(event: EventData) { this._event.next(event); }

  private readonly _location: BehaviorSubject<LocationData>;
  get location() { return this._location.value; }
  set location(location: LocationData) { this._location.next(location); }

  private readonly _courses = new  BehaviorSubject<CourseItem[]>([]);
  get courses() { return this._courses.value; }
  set courses(courses: CourseItem[]) { this._courses.next(courses); }

  constructor(private readonly remote: CourseService) {
    this._event = new BehaviorSubject<EventData|undefined>(undefined);
    this._location = new BehaviorSubject<LocationData|undefined>(undefined);
  }

  ngOnInit(): void {
    this.remote.getEvent(this.eventId).subscribe(
      event => this.event = event,
      err => console.error(err),
      () => {
        this.getLocation(this.event.location);
        this.getCourses(this.event.courses);
    });
  }

  get geolink() {
    return position2geolink(this.location?.geolocation);
  }

  private getLocation(id: LocationId) {
    this.remote.getLocation(id)
      .subscribe(location => this.location = location);
  }

  private getCourses(ids: CourseId[]) {
    this.remote.getCourses(ids)
      .subscribe(course => this.courses.push(new CourseItemExt(course)));
  }
}
