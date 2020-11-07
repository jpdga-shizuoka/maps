import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapMarker } from '@angular/google-maps';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResizedEvent } from 'angular-resize-event';

import { TeeType, HoleLine } from '../models';
import { Holes2Bounds } from '../map-utilities';
import { GoogleMapsApiService } from '../googlemapsapi.service';
import {
  PrintMapDataComponent, PrintService, RemoteService, HoleData, MarkerInfo, Line, LatLng
} from '../print-map-data.component';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent extends PrintMapDataComponent
  implements OnInit, OnDestroy
{
  @ViewChild('layoutmap') layoutmap: GoogleMap;
  private ssMaps: Subscription;
  apiLoaded = false;
  tees = [] as MarkerInfo[];
  lines = [] as Line[];
  get showButton() {
    return !this.printService.isPrinting;
  }

  constructor(
    private readonly el: ElementRef,
    private readonly googleMapsApi: GoogleMapsApiService,
    printService: PrintService,
    remote: RemoteService,
    route: ActivatedRoute,
  ) {
    super(remote, printService, route);
  }

  ngOnInit() {
    super.ngOnInit();
    const element = this.el.nativeElement.querySelector('#map-container');
    const rect = element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
  }

  ngOnDestroy() {
    this.printService.closeDocument();
    this.ssMaps?.unsubscribe();
    super.ngOnDestroy();
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  onPrint() {
    this.printService.printView();
  }

  teeOptions(index: string) {
    return {
      draggable: false,
      icon: this.getMarker(Number(index), this.teeType),
    };
  }

  get lineOptions() {
    return this.teeType === 'front'
      ? this.frontLineOptions : this.backLineOptions;
  }

  protected onReady(type: 'event' | 'course') {
    if (!this.isReady(type)) {
      return;
    }
    this.ssMaps = this.googleMapsApi.load().pipe(
      tap(() => this.loadMapsOptions()),
      tap(() => this.loadMapsObjects()),
      tap(() => this.prepareObjects()),
    ).subscribe(() => {
      this.apiLoaded = true;
      this.fitBounds(this.course.holes);
    });
  }

  private fitBounds(holes: HoleData[]) {
    setTimeout(() => this.layoutmap.fitBounds(new Holes2Bounds(holes).value));
  }

  private prepareObjects() {
    this.holes.forEach(hole => {
      const holeLine: HoleLine = hole.front || hole.back;
      const path: LatLng[] = [];
      holeLine.path.forEach(point => path.push(new google.maps.LatLng(point)));
      this.lines.push(path);

      const tee = holeLine.path[0];
      this.tees.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(tee)
      });
    });
  }
}
