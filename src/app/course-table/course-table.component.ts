import {
  Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, Input, ElementRef
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { BehaviorSubject, Subscription } from 'rxjs';

import { CommonService } from '../common.service';
import { RemoteService, HoleData, CourseId } from '../remote-service';
import { CourseDataSource } from '../course-datasource';
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
export class CourseTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<HoleData>;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  @Input() set courseId(courseId: CourseId) { this._courseId.next(courseId); }
  get courseId() { return this._courseId.value; }
  private _courseId = new BehaviorSubject<CourseId|undefined>(undefined);
  readonly displayedColumns = ['hole', 'back', 'front'];
  dataSource?: CourseDataSource;
  expandedHole: HoleData | null;
  private ssCourse: Subscription;

  constructor(
    private readonly remote: RemoteService,
    private readonly commonService: CommonService,
    private readonly el: ElementRef,
  ) {
  }

  ngOnInit() {
    this.ssCourse = this._courseId.subscribe(courseId => {
      if (!courseId) { return; }
      this.dataSource = new CourseDataSource(courseId, this.remote);
      this.table.dataSource = this.dataSource;
    })
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
  }

  backtee(hole) {
    return `${this.commonService.length(hole.back.length)}/Par${hole.back.par}`;
  }

  fronttee(hole) {
    return hole.front
      ? `${this.commonService.length(hole.front.length)}/Par${hole.front.par}`
      : '';
  }

  get backTotal() {
    if (!this.dataSource) { return '';}
    let length = 0;
    let par = 0;
    this.dataSource.data.forEach(hole => {
      length += hole.back.length;
      par += hole.back.par;
    });
    length /= this.dataSource.data.length;
    return `${this.commonService.length(length)}/Par${par}`;
  }

  get frontTotal() {
    if (!this.dataSource) { return '';}
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
    return `${this.commonService.length(length)}/Par${par}`;
  }

  get isLoading() {
    return this.dataSource?.loading;
  }

  get descriptions() {
    return this.dataSource?.descriptions;
  }

  isExpanded(hole: HoleData) {
    return this.expandedHole === hole;
  }

  hasDescriptions(hole: HoleData) {
    return hole.description && hole.description[0].length > 0;
  }

  onBackClick(hole: HoleData) {
    if (this.expandedHole === hole) {
      return;
    }
    this.issueEvent(hole, 'back');
  }

  onFrontClick(hole: HoleData) {
    if (this.expandedHole === hole) {
      return;
    }
    this.issueEvent(hole, 'front');
  }

  onLongPress(event: MouseEvent | TouchEvent, hole: HoleData) {
    const cellIndex = event.target['cellIndex'];
    this.issueEvent(hole, cellIndex === 2 ? 'front' : 'back', true);
  }

  notifyHole(data: HoleMetaData) {
    this.expandedHole
      = this.dataSource.data.find(h => h.number === data.hole);
    const element = this.el.nativeElement.querySelector(`#rowid${data.hole}`);
    element?.scrollIntoView();
  }

  private issueEvent(hole: HoleData, type: TeeType, longPressed = false) {
    const metadata = {
      hole: hole.number,
      teeType: type,
      description: hole.description,
      data: hole[type] || hole.back,
      longPressed: longPressed
    };
    this.holeClicked.emit(metadata);
  }
}
