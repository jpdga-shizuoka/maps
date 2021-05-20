import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { EventId, CourseId, TeeType } from '../models';

@Component({
  selector: 'app-caddie-book',
  templateUrl: './caddie-book.component.html',
  styleUrls: ['./caddie-book.component.css']
})
export class CaddieBookComponent {
  readonly eventId: EventId;
  readonly courseId: CourseId;
  readonly teeType: TeeType;

  constructor(
    route: ActivatedRoute,
    private printService: PrintService
  ) {
    this.eventId = route.snapshot.params.eventId as EventId;
    this.courseId = route.snapshot.params.courseId as CourseId;
    this.teeType = route.snapshot.params.teeType as TeeType || 'back';
  }

  onRuleReady(): void {
    this.printService.onDataReady();
  }
}
