import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-global-local',
  templateUrl: './global-local.component.html',
  styleUrls: ['./global-local.component.css']
})
export class GlobalLocalComponent {

  constructor(private readonly commonService: CommonService) { }

  get language() {
    return this.commonService.language;
  }

  set language(value) {
    this.commonService.language = value;
  }

  onChanged(event) {
    this.language = event.value;
  }
}
