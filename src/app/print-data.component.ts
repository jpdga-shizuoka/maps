import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TeeType, Descriptions } from './models';
import { PrintService } from './print.service';
import {
  RemoteService, EventData, HoleData, EventId, CourseId, CourseData
} from './remote-service';

export { PrintService, RemoteService, HoleData };

@Component({
  template: ''
})
export class PrintDataComponent implements OnDestroy, OnInit {
  public readonly eventId: EventId;
  public readonly courseId: CourseId;
  public readonly teeType: TeeType;
  private ssEvent: Subscription;
  private ssCourse: Subscription;
  event: EventData;
  course: CourseData;
  private state = {
    event: false,
    course: false
  };

  constructor(
    private readonly remote: RemoteService,
    protected readonly printService: PrintService,
    route: ActivatedRoute,
  ) {
    this.eventId = route.snapshot.params.eventId;
    this.courseId = route.snapshot.params.courseId;
    this.teeType = route.snapshot.params.teeType || 'back';
  }

  ngOnInit() {
    this.ssEvent = this.remote.getEvent(this.eventId).subscribe(
      event => {
        this.event = event;
        this.onReady('event');
    });
    this.ssCourse = this.remote.getCourse(this.courseId).subscribe(
      course => {
        this.course = course;
        this.onReady('course');
    });
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
    this.ssEvent?.unsubscribe();
  }

  par(data: HoleData) {
    return this.isFrontTee ? (data.front?.par || data.back.par) : data.back.par;
  }

  length(data: HoleData) {
    return this.isFrontTee ? (data.front?.length || data.back.length) : data.back.length;
  }

  get commonRules(): Descriptions | undefined {
    if (!this.course) {
      return undefined;
    }
    return this.course.description;
  }

  get holes(): HoleData[] | undefined {
    if (!this.course) {
      return undefined;
    }
    return this.course.holes;
  }

  get tee() {
    return this.isFrontTee ? 'Front Tee' : 'Back Tee';
  }

  get totalPar() {
    let par = 0;
    this.holes?.forEach(hole => par += this.par(hole));
    return par;
  }

  get totalLength() {
    let length = 0;
    this.holes?.forEach(hole => length += this.length(hole));
    return length;
  }

  get averageLength() {
    if (this.holes) {
      return this.totalLength / this.holes.length;
    }
    return 0;
  }

  private get isFrontTee() {
    return this.teeType === 'front';
  }

  protected onReady(type: 'event' | 'course') {
    if (this.isReady(type)) {
      this.printService.onDataReady();
    }
  }

  protected isReady(type: 'event' | 'course') {
    this.state[type] = true;
    return this.state.event && this.state.course;
  }
}
