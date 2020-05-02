import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';

import {
  HoleData, CourseId, CourseData, EventData, EventId, Position, Area, LocationId, LocationData
} from './models';
import { holeLength } from './map-utilities';

export { HoleData, CourseId, CourseData, EventId, LocationId, EventData, LocationData };

const options = {
  responseType: 'json'
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private readonly http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力
      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      console.log(`${operation} failed: ${error.message}`);
      // 空の結果を返して、アプリを持続可能にする
      return observableOf(result as T);
    };
  }

  getCourse(courseId: CourseId): Observable<CourseData> {
    return this.http
    .get<CourseData>(id2url('course', courseId), {responseType: 'json'})
    .pipe(
      tap(course => {
        course.description = string2array(course.description);
        course.center = array2position(course.center);
      }),
      tap(course => course.holes.forEach(hole => {
        if (hole.back) {
          hole.back.path = a2p4array(hole.back.path);
          hole.back.length = holeLength(hole.back.path);
        }
        if (hole.front) {
          hole.front.path = a2p4array(hole.front.path);
          hole.front.length = holeLength(hole.front.path);
        }
        hole.dropzones = a2p4array(hole.dropzones);
        hole.mandos = a2p4array(hole.mandos);
        hole.safeAreas = arrayOfArea(hole.safeAreas);
        hole.obAreas = arrayOfArea(hole.obAreas);
        hole.obLines = arrayOfArea(hole.obLines);
        hole.description = string2array(hole.description);
      })),
      catchError(this.handleError<CourseData>('getCourse'))
    );
  }

  getEvents(): Observable<EventData[]> {
    return this.http
    .get<EventData[]>(id2url('events'), {responseType: 'json'})
    .pipe(
      catchError(this.handleError<EventData[]>('getEvents'))
    );
  }

  getEvent(eventId: EventId): Observable<EventData> {
    return this.getEvents()
    .pipe(
      map(events => events.find(event => event.id === eventId)),
      catchError(this.handleError< EventData>('getEvent'))
    );
  }

  getLocations(): Observable<LocationData[]> {
    return this.http
    .get<LocationData[]>(locationsUrl(), {responseType: 'json'})
    .pipe(
      tap(locations =>
        locations.forEach(location =>
          location.geolocation = array2position(location.geolocation))),
      catchError(this.handleError<LocationData[]>('getLocations'))
    );
  }

  getLocation(id: LocationId): Observable<LocationData> {
    return this.getLocations()
    .pipe(
      map(locations => locations.find(location => location.id === id)),
      catchError(this.handleError< LocationData>('getLocation'))
    );
  }

  getText(path: string): Observable<string> {
    return this.http.get('assets/models/ja/' + path, {responseType: 'text'});
  }
}

function id2url(api: string, id?: CourseId | EventId) {
  return id
    ? `assets/models/${api}/${id}.json`
    : `assets/models/${api}.json`
}

function locationsUrl() {
  return `assets/models/locations.json`
}

function string2array(obj?: string | string[]) {
  if (!obj) {
    return;
  }
  return typeof obj === 'string' ? [obj] : obj;
}

function array2position(obj: number[] | Position): Position {
  return obj.constructor === Array ? {lat: obj[0], lng: obj[1]} : obj as Position;
}

function a2p4array(positions?: Position[]) {
  if (!positions) {
    return;
  }
  const result: Position[] = [];
  positions.forEach(p => result.push(array2position(p)));
  return result;
}

function arrayOfArea(areas?: Area[]) {
  if (!areas) {
    return;
  }
  const result: Area[] = [];
  areas.forEach(a => result.push(a2p4array(a)));
  return result;
}
