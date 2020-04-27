import { Component, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import { HoleMetaData } from '../models';

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
    return this.data.description && this.data.description[0].length > 0;
  }
}
