import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-meter-foot',
  templateUrl: './meter-foot.component.html',
  styleUrls: ['./meter-foot.component.css']
})
export class MeterFootComponent {

  constructor(private readonly commonService: CommonService) { }

  get lengthUnit() {
    return this.commonService.lengthUnit;
  }
  set lengthUnit(value) {
    this.commonService.lengthUnit = value;
  }

  onUnitChanged(event) {
    this.lengthUnit = event.value;
  }
}
