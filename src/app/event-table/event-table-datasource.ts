import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, tap, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

import { CourseService, EventData } from '../course-service';
export { EventData };

/**
 * Data source for the EventTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EventTableDataSource extends DataSource<EventData> {
  private readonly _loading: BehaviorSubject<boolean>;
  get loading() { return this._loading.value; }
  set loading(state: boolean) { this._loading.next(state); }

  private readonly _data: BehaviorSubject<EventData[]>;
  get data() { return this._data.value; }
  set data(events: EventData[]) { this._data.next(events); }

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private readonly courseService: CourseService) {
    super();
    this._loading = new BehaviorSubject<boolean>(true);
    this._data = new BehaviorSubject<EventData[]>([]);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<EventData[]> {
    this.loading = true;
    return this.courseService.getEvents().pipe(
      tap(data => this.data = data),
      finalize(() => this.loading = false)
    );
    // // Combine everything that affects the rendered data into one update
    // // stream for the data-table to consume.
    // const dataMutations = [
    //   observableOf(this.data),
    //   this.paginator.page,
    //   this.sort.sortChange
    // ];
    //
    // return merge(...dataMutations).pipe(
    //   map(() => return this.getPagedData(this.getSortedData([...this.data]))
    // ));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: EventData[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getSortedData(data: EventData[]) {
  //   if (!this.sort.active || this.sort.direction === '') {
  //     return data;
  //   }
  //
  //   return data.sort((a, b) => {
  //     const isAsc = this.sort.direction === 'asc';
  //     switch (this.sort.active) {
  //       case 'name': return compare(a.name, b.name, isAsc);
  //       case 'id': return compare(+a.id, +b.id, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
