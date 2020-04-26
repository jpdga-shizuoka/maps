import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService, EventData } from '../course-service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  event?: EventData;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly courseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.courseService
    .getEvent(this.eventId)
    .subscribe(event => this.event = event);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get eventId() {
    return this.route.snapshot.paramMap.get('eventId');
  }

  get isLoading() {
    return !this.event;
  }
}
