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
  private static handler = PrintService.noOperation;

  private static before(event: Event) {
    PrintService.instance.isPrintingView = true;
  }
  private static after(event: Event) {
    PrintService.handler(event);
    PrintService.instance.isPrinting = false;
    PrintService.instance.isPrintingView = false;
  }
  private static cleanUpPrinting(event: Event) {
    PrintService.instance.router.navigate([{ outlets: { print: null }}]);
  }
  private static noOperation(event: Event) {
    // no operation
  }

  isPrinting = false;
  isPrintingView = false;

  constructor(public readonly router: Router) {
    PrintService.instance = this;
    window.addEventListener('beforeprint', PrintService.before);
    window.addEventListener('afterprint', PrintService.after);
  }

  ngOnDestroy() {
    window.removeEventListener('afterprint', PrintService.after);
    window.removeEventListener('beforeprint', PrintService.before);
  }

  printDocument(
    documentName: string, eventId: EventId, courseId: CourseId, teeType: TeeType
  ) {
    if (this.isPrinting || this.isPrintingView) {
      return;
    }
    if (documentName === 'layout') {
      PrintService.handler = PrintService.noOperation;
      this.router.navigate(['/', 'layout', eventId, courseId, teeType],
      { skipLocationChange: true });
    } else {
      this.isPrinting = true;
      PrintService.handler = PrintService.cleanUpPrinting;
      this.router.navigate(['/', {
        outlets: {print: ['print', documentName, eventId, courseId, teeType]}
      }],
      { skipLocationChange: true });
    }
  }

  onDataReady() {
    setTimeout(() => window.print());
  }

  printView() {
    setTimeout(() => window.print());
  }
}
