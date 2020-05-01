import { Component } from '@angular/core';
import { LocalizeService } from '../localize.service';

@Component({
  selector: 'app-global-local',
  templateUrl: './global-local.component.html',
  styleUrls: ['./global-local.component.css']
})
export class GlobalLocalComponent {

  constructor(private readonly localizeService: LocalizeService) { }

  get language() {
    return this.localizeService.language;
  }

  set language(value) {
    this.localizeService.language = value;
  }

  onChanged(event) {
    this.language = event.value;
  }
}
