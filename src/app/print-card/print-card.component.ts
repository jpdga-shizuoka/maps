import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PrintDataComponent, PrintService, RemoteService, HoleData
} from '../print-data.component';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-print-card',
  templateUrl: './print-card.component.html',
  styleUrls: ['./print-card.component.css']
})
export class PrintCardComponent extends PrintDataComponent {

  constructor(
    private readonly commonService: CommonService,
    remote: RemoteService,
    printService: PrintService,
    route: ActivatedRoute,
  ) {
    super(remote, printService, route);
  }

  get outHoles(): HoleData[] | undefined {
    if (!this.holes) {
      return undefined;
    }
    return this.holes.slice(0, Math.min(9, this.holes.length));
  }

  get inHoles(): HoleData[] | undefined {
    if (!this.holes || this.holes.length < 10) {
      return undefined;
    }
    return this.holes.slice(9);
  }

  get isInHoles() {
    return this.inHoles != null;
  }

  get outPar() {
    let par = 0;
    this.outHoles?.forEach(hole => par += this.par(hole));
    return par;
  }

  get inPar() {
    let par = 0;
    this.inHoles?.forEach(hole => par += this.par(hole));
    return par;
  }

  get outLength() {
    let length = 0;
    this.outHoles?.forEach(hole => length += this.length(hole));
    return length;
  }

  get inLength() {
    let length = 0;
    this.inHoles?.forEach(hole => length += this.length(hole));
    return length;
  }

  get lengthUnit() {
    return this.commonService.unit();
  }
}
