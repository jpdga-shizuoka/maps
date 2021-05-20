import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintDataComponent, PrintService, RemoteService } from '../print-data.component';

@Component({
  selector: 'app-print-rules',
  templateUrl: './print-rules.component.html',
  styleUrls: ['./print-rules.component.css']
})
export class PrintRulesComponent extends PrintDataComponent {
  constructor(
    remote: RemoteService,
    printService: PrintService,
    route: ActivatedRoute
  ) {
    super(remote, printService, route);
  }
}
