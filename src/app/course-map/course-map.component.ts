import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { isHandset, Observable } from '../ng-utilities';
import { HoleMetaData, CourseId } from '../models';
import { MapsComponent } from '../maps/maps.component';
import { CourseTableComponent } from '../course-table/course-table.component';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.css']
})
export class CourseMapComponent implements OnInit {
  @ViewChild(MapsComponent) map: MapsComponent;
  @ViewChild(CourseTableComponent) table: CourseTableComponent;
  @Input() courseId: CourseId = 'chubu_open_2019.1';
  isHandset$: Observable<boolean>;

  constructor(
    private readonly sheet: MatBottomSheet,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
  }

  ngOnInit(): void {
  }

  onHoleCliked(hole: HoleMetaData) {
    this.isHandset$.subscribe(handset => {
      if (!handset) {
        this.map.panTo(hole.data.path);
      }
    }).unsubscribe();
  }

  onHoleMapCliked(hole: HoleMetaData) {
    this.isHandset$.subscribe(handset => handset
      ? this.sheet.open(HoleInfoSheetComponent, {data: hole})
      : this.table.notifyHole(hole)
    ).unsubscribe();
  }
}
