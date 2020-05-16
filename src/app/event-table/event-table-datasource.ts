import { MatTableDataSource } from '@angular/material/table';
import { CourseService, EventData } from '../course-service';
export { EventData };

/**
 * Data source for the EventTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EventTableDataSource extends MatTableDataSource<EventData> {
  loading = true;

  constructor(private readonly remote: CourseService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect() {
    this.loading = true;
    this.remote.getEvents().subscribe(
      events => this.data = events,
      err => console.log(err),
      () => this.loading = false
    );
    return super.connect();
  }
}
