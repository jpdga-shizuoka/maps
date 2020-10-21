import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EventId, CourseId, TeeType } from './models';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;

  constructor(private router: Router) { }

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
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate(['/', {
        outlets: { print: null }
      }]);
    });
  }
}
