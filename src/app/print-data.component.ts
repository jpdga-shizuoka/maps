import { Component, OnDestroy } from '@angular/core';
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
export class PrintDataComponent implements OnDestroy {
  public eventId: EventId;
  public courseId: CourseId;
  public teeType: TeeType;
  private ssParams: Subscription;
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
    route: ActivatedRoute
  ) {
    this.ssParams = route.params.subscribe(() => {
      this.state = { event: false, course: false };
      this.eventId = route.snapshot.params.eventId as EventId;
      this.courseId = route.snapshot.params.courseId as CourseId;
      this.teeType = route.snapshot.params.teeType as TeeType;
      this.ssEvent = this.remote.getEvent(this.eventId).subscribe(
        event => {
          this.event = event;
          this.onReady('event');
        });
      this.ssCourse = this.remote.getCourse(this.courseId).subscribe(
        course => {
          switch (course.category) {
            case 'pro':
              this.teeType = 'back';
              break;
            case 'ama':
              this.teeType = 'front';
              break;
          }
          this.course = course;
          this.onReady('course');
        });
    });
  }

  ngOnDestroy(): void {
    this.ssCourse?.unsubscribe();
    this.ssEvent?.unsubscribe();
    this.ssParams?.unsubscribe();
  }

  par(data: HoleData): number {
    return this.isFrontTee ? (data.front?.par || data.back.par) : data.back.par;
  }

  length(data: HoleData): number {
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

  get tee(): string {
    return this.isFrontTee ? 'Front Tee' : 'Back Tee';
  }

  get totalPar(): number {
    let par = 0;
    this.holes?.forEach(hole => { par += this.par(hole); });
    return par;
  }

  get totalLength(): number {
    let length = 0;
    this.holes?.forEach(hole => { length += this.length(hole); });
    return length;
  }

  get averageLength(): number {
    if (this.holes) {
      return this.totalLength / this.holes.length;
    }
    return 0;
  }

  private get isFrontTee() {
    return this.teeType === 'front';
  }

  protected onReady(type: 'event' | 'course'): void {
    if (this.isReady(type)) {
      this.printService.onDataReady();
    }
  }

  protected isReady(type: 'event' | 'course'): boolean {
    this.state[type] = true;
    return this.state.event && this.state.course;
  }
}
