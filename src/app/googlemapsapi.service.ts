import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, NEVER } from 'rxjs';
import { catchError, map, tap, startWith } from 'rxjs/operators';
import { environment } from '../environments/environment';

const GOOGLE_MAPS_API =
  `https://maps.googleapis.com/maps/api/js?key=${environment.googlemaps.apikey}`;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsApiService {
  private loaded = false;

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  //
  // load a script for Google Maps Api asynchronously
  // @see https://github.com/angular/components/tree/master/src/google-maps
  //
  load(): Observable<boolean> {
    if (this.loaded) {
      return NEVER.pipe(startWith(true));
    }
    return this.httpClient.jsonp(GOOGLE_MAPS_API, 'callback')
    .pipe(
      tap(() => this.loaded = true),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
