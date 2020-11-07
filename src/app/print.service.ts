import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { EventId, CourseId, TeeType } from './models';

//
//  @see https://github.com/IdanCo/angular-print-service
//  @see https://github.com/IdanCo/angular-print-service/issues/3
//
@Injectable({
  providedIn: 'root'
})
export class PrintService implements OnDestroy {
  private static instance: PrintService;
  private static afterprint(event: Event) {
    PrintService.instance.isPrinting = false;
  }
  private state: 'close' | 'open' = 'close';
  private document: string;
  private event: EventId;
  private course: CourseId;
  private tee: TeeType;

  isPrinting = false;

  constructor(public readonly router: Router) {
    PrintService.instance = this;
    window.addEventListener('afterprint', PrintService.afterprint);
  }

  ngOnDestroy() {
    window.removeEventListener('afterprint', PrintService.afterprint);
  }

  printDocument(
    document: string, event: EventId, course: CourseId, tee: TeeType
  ) {
    if (document === 'layout') {
      this.closeDocument()
      .then(() => this.router.navigate(['/', 'layout', event, course, tee],
        { skipLocationChange: true }));
    } else if (this.state === 'open' && this.isSame(document, event, course, tee)) {
      this.onDataReady();
    } else {
      this.router.navigate(['/', {
        outlets: {print: ['print', document, event, course, tee]}
      }],
      { skipLocationChange: true })
      .then(result => this.state = result ? 'open' : this.state);
    }
  }

  onDataReady() {
    setTimeout(() => window.print());
  }

  printView() {
    if (this.isPrinting) {
      return;
    }
    this.isPrinting = true;
    setTimeout(() => window.print());
  }

  closeDocument(): Promise<'open' | 'close'> {
    if (this.state === 'open') {
      return this.router.navigate([{ outlets: { print: null }}])
      .then(() => this.state = 'close');
    } else {
      return Promise.resolve('close');
    }
  }

  private isSame(document: string, event: EventId, course: CourseId, tee: TeeType) {
    return this.document === document
      && this.event === event
      && this.course === course
      && this.tee === tee;
  }
}
