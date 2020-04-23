import {
  AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { CourseDataSource, HoleInfo } from '../course-datasource';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { HoleMetaData, TeeType } from '../models';

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CourseTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<HoleInfo>;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  dataSource: CourseDataSource;
  expandedHole: HoleInfo | null;
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
    if (this.expandedHole === hole) {
      return;
    }
    const metadata = {
      hole: hole.holeNumber,
      teeType: 'back' as TeeType,
      description: hole.description,
      data: hole.back
    };
    this.holeClicked.emit(metadata);
  }

  onFrontClick(hole: HoleInfo) {
    if (this.expandedHole === hole) {
      return;
    }
    const metadata = {
      hole: hole.holeNumber,
      teeType: 'front' as TeeType,
      description: hole.description,
      data: hole.front
    };
    this.holeClicked.emit(metadata);
  }

  notifyHole(data: HoleMetaData) {
    this.expandedHole
      = this.dataSource.data.find(h => h.holeNumber === data.hole);
  }
}
