import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { CommonService } from '../common.service';
import { LocalizeService } from '../localize.service';
import { HoleMetaData } from '../models';

const TEE_NAME = {
  back: 'Back Tee',
  front: 'Front Tee',
  dz: 'Drop Zone',
  mando: 'Mando'
};

@Component({
  selector: 'app-hole-info',
  templateUrl: './hole-info.component.html',
  styleUrls: ['./hole-info.component.css']
})
export class HoleInfoComponent {
  @Input() data: HoleMetaData;
  @Input() disabled = false;
  @Output() next = new EventEmitter<HoleMetaData>();
  @Output() prev = new EventEmitter<HoleMetaData>();

  constructor(
    private readonly el: ElementRef,
    private readonly commonService: CommonService,
    private readonly localizeService: LocalizeService,
  ) { }

  get length() {
    return this.commonService.length(this.data.data.length);
  }

  get teename() {
    return this.localizeService.transform(TEE_NAME[this.data.teeType]);
  }

  get hasDescriptions() {
    switch (this.data?.teeType) {
      case 'back':
      case 'front':
        return this.data.description && this.data.description[0].length > 0;
      case 'dz':
      case 'mando':
        return true;
      default:
        return false;
    }
  }

  get descriptions() {
    switch (this.data?.teeType) {
      case 'back':
      case 'front':
        return this.data.description;
      case 'dz':
      case 'mando':
        return [this.localizeService.distanseFromMarkerToGoal(this.length, this.teename)];
      default:
        return [''];
    }
  }

  get teeMark() {
    switch (this.data?.teeType) {
      case 'back':
      case 'front':
        return `assets/maps/${this.data.teeType}tee${this.data.hole}.svg`;
      case 'dz':
        return 'assets/maps/dropzone.svg';
      case 'mando':
        return 'assets/maps/mandoMarker.svg';
      default:
        return '';
    }
  }

  get title() {
    switch (this.data?.teeType) {
      case 'back':
      case 'front':
        return `${this.length}/Par${this.data.data.par}, ${this.teename}`;
      case 'dz':
      case 'mando':
        return `#${this.data.hole} ${this.teename}`;
      default:
        return '';
    }
  }

  onClick(event) {
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    const rect = this.el.nativeElement.getBoundingClientRect();
    if (event.clientX < rect.width / 2) {
      this.prev.emit(this.data);
    } else if (event.clientX > rect.width / 2) {
      this.next.emit(this.data);
    }
  }
}
