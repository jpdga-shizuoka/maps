import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(
    private readonly router: Router,
  ) {
    // https://medium.com/angular-in-depth/refresh-current-route-in-angular-512a19d58f6e
    // https://medium.com/@rakshitshah/refresh-angular-component-without-navigation-148a87c2de3f
    // https://stackoverflow.com/questions/58202702/angular-8-router-does-not-fire-any-events-with-onsameurlnavigation-reload-w
    //
    // refresh this component evenwhen url updated with same address
    //
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.subscription = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => this.router.navigated = false);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
