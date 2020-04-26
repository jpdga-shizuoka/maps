import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';

import { HoleData, CourseId, CourseData, EventData, EventId } from './models';
import { holeLength } from './map-utilities';

export { HoleData, CourseId, CourseData, EventId, EventData };

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
      tap(course => course.description = string2array(course.description)),
      tap(course => course.holes.forEach(hole => {
        if (hole.back) {
          hole.back.length = holeLength(hole.back.path);
        }
        if (hole.front) {
          hole.front.length = holeLength(hole.front.path);
        }
        hole.description = string2array(hole.description);
      })),
      catchError(this.handleError<CourseData>('getCourse'))
    );
  }

  getEvents(): Observable<EventData[]> {
    return this.http
    .get<EventData[]>(id2url('events'), {responseType: 'json'})
    .pipe(
      tap(events => events.forEach(event =>
        event.description = string2array(event.description))),
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
}

function id2url(api: string, id?: CourseId | EventId) {
  return id
    ? `assets/models/${api}/${id}.json`
    : `assets/models/${api}.json`
}

function string2array(obj: string | string[]): string[] {
  return typeof obj === 'string' ? [obj] : obj;
}
