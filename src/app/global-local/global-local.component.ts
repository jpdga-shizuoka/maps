import { Component } from '@angular/core';
import { Location } from '@angular/common';
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
    private readonly localize: LocalizeService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
  ) { }

  get language() {
    return this.localize.language;
  }

  set language(value) {
    this.localize.language = value;
  }

  get message() {
    return this.localize.transform('UI language changed.');
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
    // @see https://stackoverflow.com/questions/47813927/how-to-refresh-a-component-in-angular
    // @note The following technique is working, but it affects routerLinkActive;
    // https://medium.com/@rakshitshah/refresh-angular-component-without-navigation-148a87c2de3f
    const currentPath = this.location.path().replace(/^\//, '');
    this.router.navigate(['reload'])
    .then(() => this.router.navigate([currentPath]));
  }
}
