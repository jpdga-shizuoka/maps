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

  private state: 'close' | 'open' = 'close';
  private document: string;
  private event: EventId;
  private course: CourseId;
  private tee: TeeType;

  isPrinting = false;

  private static afterprint() {
    PrintService.instance.isPrinting = false;
  }

  constructor(public readonly router: Router) {
    PrintService.instance = this;
    window.addEventListener('afterprint', () => { PrintService.afterprint(); });
  }

  ngOnDestroy(): void {
    window.removeEventListener('afterprint', () => { PrintService.afterprint(); });
  }

  printDocument(document: string, event: EventId, course: CourseId, tee: TeeType): void {
    if (document === 'layout') {
      this.closeDocument()
        .then(() => this.router.navigate(['/', 'layout', event, course, tee], { skipLocationChange: true }))
        .catch(e => { console.error(e); });
    } else if (this.state === 'open' && this.isSame(document, event, course, tee)) {
      this.onDataReady();
    } else {
      this.router.navigate(['/', {
        outlets: {
          print: ['print', document, event, course, tee]
        }
      }], { skipLocationChange: true }).then(result => {
        this.state = result ? 'open' : this.state;
        this.document = document;
        this.event = event;
        this.course = course;
        this.tee = tee;
      }).catch(e => { console.error(e); });
    }
  }

  onDataReady(): void {
    setTimeout(() => window.print());
  }

  printView(): void {
    if (this.isPrinting) {
      return;
    }
    this.isPrinting = true;
    setTimeout(() => window.print());
  }

  closeDocument(): Promise<'open' | 'close'> {
    if (this.state === 'open') {
      return this.router.navigate([{ outlets: { print: null } }])
        .then(() => {
          this.state = 'close';
          return this.state;
        });
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
