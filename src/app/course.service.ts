import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { HoleInfo } from './models';
import COURSE_DATA from '../assets/models/chubu_open_2019.1.pro.open.json';

export { HoleInfo };

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() { }

  getCourse(): Observable<HoleInfo[]> {
    return of(COURSE_DATA);
  }
}
