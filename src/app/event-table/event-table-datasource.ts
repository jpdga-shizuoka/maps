import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { RemoteService, EventData, EventId } from '../remote-service';
export { EventData };

/**
 * Data source for the EventTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EventTableDataSource extends MatTableDataSource<EventData> {
  constructor(private readonly remote: RemoteService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): BehaviorSubject<EventData[]> {
    this.remote.getEvents().subscribe(
      events => { this.data = events; },
      err => { console.log(err); }
    );
    return super.connect();
  }

  find(id: EventId): EventData | undefined {
    return this.data.find(event => event.id === id);
  }
}
