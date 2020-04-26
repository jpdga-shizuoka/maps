import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

import { CourseService, HoleData, CourseId } from './course-service';

export { HoleData, CourseId };

/**
 * Data source for the CourseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CourseDataSource extends DataSource<HoleData> {

  private readonly _loading: BehaviorSubject<boolean>;
  get loading() { return this._loading.value; }
  set loading(state: boolean) { this._loading.next(state); }

  private readonly _data: BehaviorSubject<HoleData[]>;
  get data() { return this._data.value; }
  set data(info: HoleData[]) { this._data.next(info); }

  constructor(
    private readonly courseId: CourseId,
    private readonly service: CourseService,
  ) {
    super();
    this._loading = new BehaviorSubject<boolean>(true);
    this._data = new BehaviorSubject<HoleData[]>([]);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HoleData[]> {
    this.loading = true;
    return this.service
      .getCourse(this.courseId)
      .pipe(
        map(course => course.holes),
        tap(holes => this.data = holes),
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
