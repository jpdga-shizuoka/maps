import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LocalizeService } from '../localize.service';

@Component({
  selector: 'app-global-local',
  templateUrl: './global-local.component.html',
  styleUrls: ['./global-local.component.css']
})
export class GlobalLocalComponent {

  constructor(
    private readonly localizeService: LocalizeService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
  ) { }

  get language() {
    return this.localizeService.language;
  }

  set language(value) {
    this.localizeService.language = value;
  }

  get message() {
    return this.localizeService.transform('UI language changed.');
  }

  onChanged(event) {
    this.language = event.value;
    this.requestReloadCurrentPage();
    this.snackbar.open(this.message, '', {
      panelClass: 'app-snackbar',
      duration: 2500
    });
  }

  private requestReloadCurrentPage() {
    this.router.navigate(['.'],  { skipLocationChange: true });
  }
}
