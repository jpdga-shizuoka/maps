import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
  title = environment.title;
}
