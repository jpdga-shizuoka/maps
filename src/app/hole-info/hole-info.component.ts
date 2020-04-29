import { Component, OnInit, Input } from '@angular/core';

import { HoleMetaData } from '../models';

const TEE_NAME = {
  back: 'バックティー',
  front: 'フロントティー',
  dz: 'ドロップゾーン',
  mando: 'マンダトリー'
};

@Component({
  selector: 'app-hole-info',
  templateUrl: './hole-info.component.html',
  styleUrls: ['./hole-info.component.css']
})
export class HoleInfoComponent implements OnInit {
  @Input() data: HoleMetaData;

  constructor() { }

  ngOnInit(): void {
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
        return [`${TEE_NAME[this.data.teeType]}からターゲットまで, ${this.data.data.length}m`];
      default:
        return '';
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
        return `${this.data.data.length}m/Par${this.data.data.par} ${TEE_NAME[this.data.teeType]}`;
      case 'dz':
      case 'mando':
        return `#${this.data.hole} ${TEE_NAME[this.data.teeType]}`;
      default:
        return '';
    }
  }
}
