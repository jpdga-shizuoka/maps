import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { CourseService, HoleInfo } from './course-service';

export { HoleInfo };

/**
 * Data source for the CourseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable({
  providedIn: 'root'
})
export class CourseDataSource extends DataSource<HoleInfo> {

  private readonly _loading: BehaviorSubject<boolean>;
  get loading() { return this._loading.value; }
  set loading(state: boolean) { this._loading.next(state); }

  private readonly _data: BehaviorSubject<HoleInfo[]>;
  get data() { return this._data.value; }
  set data(info: HoleInfo[]) { this._data.next(info); }

  constructor(private service: CourseService) {
    super();
    this._loading = new BehaviorSubject<boolean>(true);
    this._data = new BehaviorSubject<HoleInfo[]>([]);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HoleInfo[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    this.loading = true;
    return this.service
      .connect()
      .pipe(
        tap(data => this.data = data),
        finalize(() => this.loading = false)
      );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }
}
