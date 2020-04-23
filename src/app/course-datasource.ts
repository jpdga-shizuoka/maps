import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';

import { HoleInfo } from './models';
import { holeLength } from './map-utilities';
import COURSE_DATA from '../assets/models/chubu_open_2019.1.pro.open.json';

export { HoleInfo };

/**
 * Data source for the CourseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CourseDataSource extends DataSource<HoleInfo> {
  data: HoleInfo[] = COURSE_DATA;

  constructor() {
    super();

    this.data.forEach(hole => {
      if (hole.back) {
        hole.back.length = holeLength(hole.back.path);
      }
      if (hole.front) {
        hole.front.length = holeLength(hole.front.path);
      }
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HoleInfo[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return observableOf(this.data);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }
}
