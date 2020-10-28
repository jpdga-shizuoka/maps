import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { EventId, CourseId, TeeType } from './models';

//
//  a workaround for running on mobile device.
//  @see https://github.com/IdanCo/angular-print-service/issues/3
//
let self: PrintService;

function afterprintHandler(event: Event) {
  if (!self) { return; }
  self.isPrinting = false;
  self.router.navigate([{ outlets: { print: null }}]);
}

function addAfterprintHandler(target: PrintService) {
  self = target;
  window.addEventListener('afterprint', afterprintHandler);
}

function removeAfterprintHandler() {
  window.removeEventListener('afterprint', afterprintHandler);
  self = null;
}

//
//  @see https://github.com/IdanCo/angular-print-service
//
@Injectable({
  providedIn: 'root'
})
export class PrintService implements OnDestroy {
  isPrinting = false;

  constructor(public readonly router: Router) {
    addAfterprintHandler(this);
  }

  ngOnDestroy() {
    removeAfterprintHandler();
  }

  printDocument(
    documentName: string, eventId: EventId, courseId: CourseId, teeType: TeeType
  ) {
    if (this.isPrinting) {
      return;
    }
    this.isPrinting = true;
    this.router.navigate(['/', {
      outlets: {print: ['print', documentName, eventId, courseId, teeType]}
    }],
    { skipLocationChange: true });
  }

  onDataReady() {
    setTimeout(() => window.print());
  }
}
