//
//  see https://stackblitz.com/edit/long-press?file=long-press.ts
//
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[app-long-press]'
})
export class LongPress {
  timeout: number;

  @Output() onLongPress = new EventEmitter();

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.timeout = setTimeout(() => this.onLongPress.emit(event), 2000);
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  @HostListener('mouseleave')
  endPress() {
    clearTimeout(this.timeout);
  }
}
