import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CourseService } from '../course-service';

@Component({
  selector: 'app-preface',
  templateUrl: './preface.component.html',
  styleUrls: ['./preface.component.css']
})
export class PrefaceComponent implements OnInit {

  readonly content$: BehaviorSubject<string>;

  constructor(private readonly remoteService: CourseService) {
    this.content$ = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.remoteService.getText('preface.html')
      .subscribe(data => this.content$.next(data));
  }
}
