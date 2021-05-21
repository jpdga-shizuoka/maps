import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';

import { LocalizeService, Language } from '../localize.service';

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
    private readonly snackbar: MatSnackBar
  ) { }

  get language(): Language {
    return this.localize.language;
  }

  set language(value: Language) {
    this.localize.language = value;
  }

  get message(): string {
    return this.localize.transform('UI language changed.');
  }

  onChanged(event: MatRadioChange): void {
    this.language = event.value as Language;
    this.requestReloadCurrentPage().then(() => {
      this.snackbar.open(this.message, '', {
        panelClass: 'app-snackbar',
        duration: 2500
      });
    }).catch(e => { console.log(e); });
  }

  private async requestReloadCurrentPage(): Promise<void> {
    // @see https://stackoverflow.com/questions/47813927/how-to-refresh-a-component-in-angular
    // @note The following technique is working, but it affects routerLinkActive;
    // https://medium.com/@rakshitshah/refresh-angular-component-without-navigation-148a87c2de3f
    const currentPath = this.location.path().replace(/^\//, '');
    await this.router.navigate(['reload'], { skipLocationChange: true });
    await this.router.navigate([currentPath], { skipLocationChange: true });
  }
}
