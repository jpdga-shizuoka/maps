import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import { HoleInfo } from './models';
import { holeLength } from './map-utilities';

export { HoleInfo };

/**
 * Data source for the CourseTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private courseId = 'chubu_open_2019.1';

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力
      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      console.log(`${operation} failed: ${error.message}`);
      // 空の結果を返して、アプリを持続可能にする
      return observableOf(result as T);
    };
  }

  private get url() {
    return `assets/models/${this.courseId}.json`;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<HoleInfo[]> {
    return this.http
    .get<HoleInfo[]>(this.url, {responseType: 'json'})
    .pipe(
      tap(holes => holes.forEach(hole => {
        if (hole.back) {
          hole.back.length = holeLength(hole.back.path);
        }
        if (hole.front) {
          hole.front.length = holeLength(hole.front.path);
        }
      })),
      catchError(this.handleError<HoleInfo[]>('getHoleinfo', []))
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }
}
