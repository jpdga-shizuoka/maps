import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CourseTableDataSource, HoleInfo } from './course-table-datasource';

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<HoleInfo>;
  dataSource: CourseTableDataSource;

  displayedColumns = ['hole', 'back', 'front'];

  ngOnInit() {
    this.dataSource = new CourseTableDataSource();
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
}
