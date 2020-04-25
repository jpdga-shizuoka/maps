import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HoleinfoDataSource, HoleInfo } from './holeinfo-datasource';

export { HoleInfo };

/**
 * Data source for the CourseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CourseDataSource extends DataSource<HoleInfo> {
  data: HoleInfo[] = [];

  constructor(private service: HoleinfoDataSource) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HoleInfo[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return this.service
    .connect()
    .pipe(tap(data => this.data = data));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }
}
