import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { EventId, CourseId, TeeType } from '../models';

@Component({
  selector: 'app-caddie-book',
  templateUrl: './caddie-book.component.html',
  styleUrls: ['./caddie-book.component.css']
})
export class CaddieBookComponent implements OnInit {
  readonly eventId: EventId;
  readonly courseId: CourseId;
  readonly teeType: TeeType;

  constructor(
    route: ActivatedRoute,
    private printService: PrintService,
  ) {
    this.eventId = route.snapshot.params['eventId'];
    this.courseId = route.snapshot.params['courseId'];
    this.teeType = route.snapshot.params['teeType'] || 'back';
  }

  ngOnInit(): void {
  }

  onRuleReady() {
    this.printService.onDataReady();
  }
}
