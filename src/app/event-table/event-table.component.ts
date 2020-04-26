import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { EventTableDataSource, EventData } from './event-table-datasource';
import { CourseService } from '../course-service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<EventData>;
  dataSource?: EventTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  readonly displayedColumns = ['id', 'name'];

  constructor(private readonly courseService: CourseService) { }

  ngOnInit() {
    this.dataSource = new EventTableDataSource(this.courseService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
