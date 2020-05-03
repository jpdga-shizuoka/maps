import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { CourseService } from '../course-service';

@Component({
  selector: 'app-preface',
  templateUrl: './preface.component.html',
  styleUrls: ['./preface.component.css']
})
export class PrefaceComponent implements OnInit, OnDestroy {

  readonly content$: BehaviorSubject<string>;
  private subscription?: Subscription;

  constructor(private readonly remoteService: CourseService) {
    this.content$ = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.subscription = this.remoteService
    .getText('preface.html')
    .subscribe(data => this.content$.next(data));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
