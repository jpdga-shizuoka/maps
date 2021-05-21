import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';

import { EventTableDataSource, EventData } from './event-table-datasource';
import { RemoteService, EventId } from '../remote-service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class EventTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<EventData>;
  @Input() set eventId(id: EventId) { this._eventid.next(id); }

  get eventId(): EventId { return this._eventid.value; }
  private _eventid = new BehaviorSubject<EventId|undefined>(undefined);
  private ssEvent: Subscription;
  private ssSourse: Subscription;
  dataSource: EventTableDataSource;
  expandedEvent?: EventData;
  readonly displayedColumns = ['date', 'name'];

  constructor(private readonly remote: RemoteService) { }

  ngOnInit(): void {
    this.dataSource = new EventTableDataSource(this.remote);
    this.ssEvent = this._eventid.subscribe(id => {
      this.dataSource.filter = id;
      this.ssSourse = this.dataSource.connect()
        .subscribe(() => { this.expandedEvent = this.dataSource.find(id); });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnDestroy(): void {
    this.ssSourse?.unsubscribe();
    this.ssEvent?.unsubscribe();
  }

  get showPaginator(): boolean {
    return !this.eventId;
  }
}
