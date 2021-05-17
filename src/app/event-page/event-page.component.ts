import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteService, EventData, EventId } from '../remote-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
  readonly title = environment.title;
  eventId: EventId;
  event: EventData;

  constructor(
    route: ActivatedRoute,
    remote: RemoteService,
  ) {
    route.params.subscribe(params => {
      this.eventId = params.eventId as EventId;
      if (this.eventId) {
        remote.getEvent(this.eventId).subscribe(event => this.event = event);
      } else {
        this.event = undefined;
      }
    });
  }
}
