import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';

import { EventTableDataSource, EventData } from './event-table-datasource';
import { RemoteService } from '../remote-service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EventTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<EventData>;
  dataSource?: EventTableDataSource;
  expandedEvent: EventData | null;
  search = '';

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  readonly displayedColumns = ['date', 'name'];

  constructor(private readonly remote: RemoteService) { }

  ngOnInit() {
    this.dataSource = new EventTableDataSource(this.remote);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
