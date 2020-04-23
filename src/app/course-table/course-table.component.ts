import {
  AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter
} from '@angular/core';
import { MatTable } from '@angular/material/table';

import { CourseDataSource, HoleInfo } from '../course-datasource';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { HoleMetaData, TeeType } from '../models';

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<HoleInfo>;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  dataSource: CourseDataSource;

  displayedColumns = ['hole', 'back', 'front'];

  constructor() {}

  ngOnInit() {
    this.dataSource = new CourseDataSource();
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
  }

  backtee(hole) {
    return `${Math.round(hole.back.length)}m / Par${hole.back.par}`;
  }

  fronttee(hole) {
    return hole.front
      ? `${Math.round(hole.front.length)}m / Par${hole.front.par}`
      : '';
  }

  get backTotal() {
    let length = 0;
    let par = 0;
    this.dataSource.data.forEach(hole => {
      length += hole.back.length;
      par += hole.back.par;
    });
    length /= this.dataSource.data.length;
    return `${Math.round(length)}m / Par${par}`;
  }

  get frontTotal() {
    let length = 0;
    let par = 0;
    this.dataSource.data.forEach(hole => {
      if (hole.front) {
        length += hole.front.length;
        par += hole.front.par;
      } else {
        length += hole.back.length;
        par += hole.back.par;
      }
    });
    length /= this.dataSource.data.length;
    return `${Math.round(length)}m / Par${par}`;
  }

  onBackClick(hole: HoleInfo) {
    const metadata = {
      hole: hole.holeNumber,
      teeType: 'back' as TeeType,
      description: hole.description,
      data: hole.back
    };
    this.holeClicked.emit(metadata);
  }

  onFrontClick(hole: HoleInfo) {
    const metadata = {
      hole: hole.holeNumber,
      teeType: 'front' as TeeType,
      description: hole.description,
      data: hole.front
    };
    this.holeClicked.emit(metadata);
  }
}
