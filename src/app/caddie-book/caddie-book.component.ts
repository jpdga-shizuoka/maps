import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-caddie-book',
  templateUrl: './caddie-book.component.html',
  styleUrls: ['./caddie-book.component.css']
})
export class CaddieBookComponent implements OnInit {
  private readonly eventId: string;
  private readonly courseId: string;

  constructor(
    route: ActivatedRoute,
    private printService: PrintService,
  ) {
    this.eventId = route.snapshot.params['eventId'];
    this.courseId = route.snapshot.params['courseId'];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.printService.onDataReady();
  }
}
