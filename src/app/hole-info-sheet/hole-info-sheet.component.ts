import { Component, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import { HoleMetaData } from '../models';

const TEE_NAME = {
  back: 'バックティー',
  front: 'フロントティー',
  dz: 'ドロップゾーン',
  mando: 'マンダトリー'
}

@Component({
  selector: 'app-hole-info-sheet',
  templateUrl: './hole-info-sheet.component.html',
  styleUrls: ['./hole-info-sheet.component.css']
})
export class HoleInfoSheetComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: HoleMetaData,
  ) { }

  get hasDescriptions() {
    switch(this.data.teeType) {
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
    switch(this.data.teeType) {
      case 'back':
      case 'front':
        return this.data.description;
      case 'dz':
      case 'mando':
        return [`${TEE_NAME[this.data.teeType]}からターゲットまで, ${this.data.data.length}m`];
      default:
        return '';
    }
  }

  get teeMark() {
    switch(this.data.teeType) {
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
    switch(this.data.teeType) {
      case 'back':
      case 'front':
        return `${this.data.data.length}m/Par${this.data.data.par} ${TEE_NAME[this.data.teeType]}`;
      case 'dz':
      case 'mando':
        return `#${this.data.hole} ${TEE_NAME[this.data.teeType]}`;
      default:
        return '';
    }
  }
}
