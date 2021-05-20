import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RemoteService } from '../remote-service';

@Component({
  selector: 'app-preface',
  templateUrl: './preface.component.html',
  styleUrls: ['./preface.component.css']
})
export class PrefaceComponent implements OnInit {
  readonly content$: BehaviorSubject<string>;

  constructor(private readonly remote: RemoteService) {
    this.content$ = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.remote.getText('preface.html')
      .subscribe(data => this.content$.next(data));
  }
}
