import {
  Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, Input,
  ElementRef, AfterViewInit
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
export class CourseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<HoleData>;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  @Output() print = new EventEmitter();
  @Input()
  set courseId(courseId: CourseId) { this._courseId.next(courseId); }
  get courseId() { return this._courseId.value; }
  private _courseId = new BehaviorSubject<CourseId|undefined>(undefined);
  set dataSource(dataSource: CourseDataSource) { this._dataSource.next(dataSource); }
  get dataSource() { return this._dataSource.value; }
  private _dataSource = new BehaviorSubject<CourseDataSource|undefined>(undefined);
  private ssCourse: Subscription;
  private ssDataSource: Subscription;
  get displayedColumns() {
    return this.isAllBackTee
      ? ['hole', 'back'] : ['hole', 'back', 'front'];
  }
  get isAllBackTee() {
    if (!this.dataSource) {
      return false;
    }
    let front = false;
    this.dataSource.data.forEach(hole => {
      if (hole.front) {
        front = true;
      }
    });
    return !front;
  }
  expandedHole: HoleData | null;

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
    });
  }

  ngAfterViewInit() {
    this.ssDataSource = this._dataSource.subscribe(dataSource => {
      if (!dataSource) { return; }
      this.table.dataSource = dataSource;
    });
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
    this.ssDataSource?.unsubscribe();
  }

  backtee(hole) {
    if (hole.back) {
      return this.commonService.length(hole.back.length)
      + (hole.back.elevation ? `/${sign(hole.back.elevation)}${this.commonService.length(hole.back.elevation)}` : '')
      + '/Par' + hole.back.par;
    } else {
      return '';
    }
  }

  fronttee(hole) {
    if (hole.front) {
      return this.commonService.length(hole.front.length)
      + (hole.front.elevation ? `/${sign(hole.back.elevation)}${this.commonService.length(hole.front.elevation)}` : '')
      + '/Par' + hole.front.par;
    } else {
      return '';
    }
  }

  get backTotal() {
    if (!this.dataSource) { return ''; }
    let length = 0;
    let par = 0;
    this.dataSource.data.forEach(hole => {
      length += hole.back?.length || hole.front?.length;
      par += hole.back?.par || hole.front?.par;
    });
    length /= this.dataSource.data.length;
    return `${this.commonService.length(length)}/Par${par}`;
  }

  get frontTotal() {
    if (!this.dataSource) { return ''; }
    let length = 0;
    let par = 0;
    this.dataSource.data.forEach(hole => {
      length += hole.front?.length || hole.back?.length;
      par += hole.front?.par || hole.back?.par;
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
    const cellIndex = (event.target as HTMLTableCellElement).cellIndex;
    this.issueEvent(hole, cellIndex === 2 ? 'front' : 'back', true);
  }

  onPrint() {
    this.print.emit();
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
      longPressed
    };
    this.holeClicked.emit(metadata);
  }
}

function sign(length: number) {
  return length > 0 ? '+' : '';
}
