import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, of } from 'rxjs';
import { map, shareReplay, filter, mergeMap } from 'rxjs/operators';

import { environment } from '../environments/environment';

export interface MetaData {
  title: string;
  type?: string;
  url?: string;
  image?: string;
  description?: string;
  keywords?: string;
}

export interface MetaDescription {
  ngActivatedRoute: ActivatedRoute;
  ngTitle: Title;
  ngMeta: Meta;
  ngRouter: Router;
}

export {
  BreakpointObserver,
  Observable,
  Subscription
};

export function isHandset(observer: BreakpointObserver): Observable<boolean> {
  return observer
  .observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay(1)
  );
}

export function subscribeMetaDescription(mdo: MetaDescription): Subscription {
  return mdo.ngRouter.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => mdo.ngActivatedRoute),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    filter(route => route.outlet === 'primary'),
    mergeMap(route => route.data)
  ).subscribe((data: any) => updateDescription(mdo, data));
}

function updateDescription(mdo: MetaDescription, data?: any): void {
  if (!data.metaDescription) {
    return;
  }
  const md = data.metaDescription as MetaData;
  const url = window.location.protocol + '//' + window.location.host;
  const image = url + environment.projectPathName + '/assets/img/shizuoka-jpdga.002.png';
  const href = url + window.location.pathname;
  mdo.ngTitle.setTitle(md.title);
  mdo.ngMeta.updateTag({ name: 'description', content: md.description });
  mdo.ngMeta.updateTag({ property: 'og:description', content: md.description });
  mdo.ngMeta.updateTag({ property: 'og:title', content: md.title });
  mdo.ngMeta.updateTag({ property: 'og:type', content: md.type || 'website' });
  mdo.ngMeta.updateTag({ property: 'og:url', content: md.url || href });
  mdo.ngMeta.updateTag({ property: 'og:image', content: md.image || image});
  if (md.keywords) {
    mdo.ngMeta.updateTag({ name: 'keywords', content: md.keywords });
  }
}
