import {
  Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Descriptions, TeeType } from '../models';
import {
  RemoteService, EventData, HoleData, EventId, CourseId, CourseData
} from '../remote-service';

@Component({
  selector: 'app-print-rules',
  templateUrl: './print-rules.component.html',
  styleUrls: ['./print-rules.component.css']
})
export class PrintRulesComponent implements OnDestroy, OnInit {
  @Input() eventId: EventId;
  @Input() courseId: CourseId;
  @Input() teeType: TeeType;
  @Output() ready = new EventEmitter();
  private ssEvent?: Subscription;
  private ssCourse?: Subscription;
  event: EventData;
  course: CourseData;
  private state = {
    event: false,
    course: false
  }

  constructor(
    private readonly remote: RemoteService,
  ) {
  }

  ngOnInit() {
    this.ssEvent = this.remote.getEvent(this.eventId).subscribe(
      event => this.event = event,
      err => console.log(err),
      () => this.onReady('event')
    );
    this.ssCourse = this.remote.getCourse(this.courseId).subscribe(
      course => this.course = course,
      err => console.log(err),
      () => this.onReady('course')
    );
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
    this.ssEvent?.unsubscribe();
  }

  Par(data: HoleData) {
    return this.isFrontTee ? (data.front?.par || data.back.par) : data.back.par;
  }
  Length(data: HoleData) {
    return this.isFrontTee ? (data.front?.length || data.back.length) : data.back.length;
  }

  get tee() {
    return this.isFrontTee ? 'Front Tee' : 'Back Tee';
  }

  get TotalPar() {
    let par = 0;
    this.course?.holes.forEach(hole => par += this.Par(hole));
    return par;
  }

  get TotalLength() {
    let length = 0;
    this.course?.holes.forEach(hole => length += this.Length(hole));
    return length;
  }

  get AverageLength() {
    if (this.course) {
      return this.TotalLength / this.course.holes.length;
    }
    return 0;
  }

  private get isFrontTee() {
    return this.teeType === 'front';
  }

  private onReady(type: 'event' | 'course') {
    this.state[type] = true;
    if (this.state.event && this.state.course) {
      this.ready.emit();
    }
  }
}
