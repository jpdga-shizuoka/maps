import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResizedEvent } from 'angular-resize-event';

import { HoleLine } from '../models';
import { Holes2Bounds } from '../map-utilities';
import { GoogleMapsApiService } from '../googlemapsapi.service';
import {
  PrintMapDataComponent, PrintService, RemoteService, HoleData, MarkerInfo, Line, LatLng
} from '../print-map-data.component';
import { FrontLineOptions, MarkerType } from '../maps-options';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent extends PrintMapDataComponent implements OnInit, OnDestroy {
  @ViewChild('layoutmap') layoutmap: GoogleMap;
  private ssMaps: Subscription;
  apiLoaded = false;
  tees = [] as MarkerInfo[];
  lines = [] as Line[];
  get showButton(): boolean {
    return !this.printService.isPrinting;
  }

  constructor(
    private readonly el: ElementRef<Element>,
    private readonly googleMapsApi: GoogleMapsApiService,
    printService: PrintService,
    remote: RemoteService,
    route: ActivatedRoute
  ) {
    super(remote, printService, route);
  }

  ngOnInit(): void {
    const element = this.el.nativeElement.querySelector('#map-container');
    const rect = element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
  }

  ngOnDestroy(): void {
    this.printService.closeDocument().then(() => {
      this.ssMaps?.unsubscribe();
      super.ngOnDestroy();
    }).catch(e => { console.error(e); });
  }

  onResized(event: ResizedEvent): void {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  onPrint(): void {
    this.printService.printView();
  }

  teeOptions(index: string): MarkerType {
    return {
      draggable: false,
      icon: this.getMarker(Number(index), this.teeType)
    };
  }

  get lineOptions(): FrontLineOptions {
    return this.teeType === 'front' ? this.frontLineOptions : this.backLineOptions;
  }

  protected onReady(type: 'event' | 'course'): void {
    if (!this.isReady(type)) {
      return;
    }
    this.ssMaps = this.googleMapsApi.load().pipe(
      tap(() => this.loadMapsOptions()),
      tap(() => this.loadMapsObjects()),
      tap(() => this.prepareObjects())
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
