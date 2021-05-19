//
//  see https://stackblitz.com/edit/long-press?file=long-press.ts
//
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  timeout: number;

  @Output() longPressed = new EventEmitter();

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: UIEvent): void {
    this.timeout = window.setTimeout(() => this.longPressed.emit(event), 2000);
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  @HostListener('mouseleave')
  endPress(): void {
    clearTimeout(this.timeout);
  }
}
