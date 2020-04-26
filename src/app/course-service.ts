import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { HoleData, CourseId, CourseData } from './models';
import { holeLength } from './map-utilities';

export { HoleData, CourseId, CourseData };

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
      tap(course => course.holes.forEach(hole => {
        if (hole.back) {
          hole.back.length = holeLength(hole.back.path);
        }
        if (hole.front) {
          hole.front.length = holeLength(hole.front.path);
        }
      })),
      catchError(this.handleError<CourseData>('getCourse'))
    );
  }
}

function id2url(api: string, courseId: CourseId) {
  return `assets/models/${api}/${courseId}.json`;
}
