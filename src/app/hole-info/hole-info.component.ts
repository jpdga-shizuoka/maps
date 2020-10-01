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

  get elevation() {
    if (!this.data.data.elevation) {
      return '';
    }
    return sign(this.data.data.elevation) 
    + this.commonService.length(this.data.data.elevation);
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
        return [
          this.localizeService.distanseFromMarkerToGoal(this.length, this.teename)
        ];
      case 'mando':
        const descriptions
          = [this.localizeService.distanseFromMarkerToGoal(this.length, this.teename)];
        if (this.data.fromBacktee) {
          const length = this.commonService.length(this.data.fromBacktee.length);
          descriptions.push(this.localizeService.distanseFromBackteeToMarker(length, this.teename));
        }
        if (this.data.fromFronttee) {
          const length = this.commonService.length(this.data.fromFronttee.length);
          descriptions.push(this.localizeService.distanseFromFrontteeToMarker(length, this.teename));
        }
        return descriptions;
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
        if (this.data.data.elevation) {
          return `${this.length}/${this.elevation}/Par${this.data.data.par}`;
        } else {
          return `${this.length}/Par${this.data.data.par}`;
        }
      case 'dz':
      case 'mando':
        return `#${this.data.hole}`;
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

function sign(length: number) {
  return length > 0 ? '+' : '';
}
