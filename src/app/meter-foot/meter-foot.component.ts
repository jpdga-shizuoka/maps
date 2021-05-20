import { Component } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { CommonService, LengthUnit } from '../common.service';

@Component({
  selector: 'app-meter-foot',
  templateUrl: './meter-foot.component.html',
  styleUrls: ['./meter-foot.component.css']
})
export class MeterFootComponent {
  constructor(private readonly commonService: CommonService) { }

  get lengthUnit(): LengthUnit {
    return this.commonService.lengthUnit;
  }

  set lengthUnit(value: LengthUnit) {
    this.commonService.lengthUnit = value;
  }

  onUnitChanged(event: MatRadioChange): void {
    this.lengthUnit = event.value as LengthUnit;
  }
}
