import {
  Component, OnInit, OnDestroy, Input, Output, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, MapMarker } from '@angular/google-maps';

import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { Position, HoleMetaData, TeeType } from '../models';
import {
  RemoteService, EventData, HoleData, EventId, CourseId, CourseData
} from '../remote-service';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { Holes2Bounds } from '../map-utilities';
import { PrintService } from '../print.service';
import { GoogleMapsApiService } from '../googlemapsapi.service';
import {
  MapsOptions,
  LoadMapsOptions,
  MapOptions,
  SafeAreaOptions,
  ObLineOptions,
  ObAreaOptions,
  HazardAreaOptions,
  BackLineOptions,
  FrontLineOptions,
  DropZoneOptions,
  MandoOptions,
  Marker,
} from '../maps-options';
import {
  MapsObjects, LoadMapsObjects, Line, Area, MarkerInfo
} from '../maps-objects';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent
  implements OnInit, OnDestroy, MapsOptions, MapsObjects {
  @ViewChild('layoutmap') layoutmap: GoogleMap;
  private eventId: EventId;
  private courseId: CourseId;
  private teeType: TeeType;
  private ssEvent: Subscription;
  private ssCourse: Subscription;
  private ssMaps: Subscription;
  private event: EventData;
  private course: CourseData;
  private state = {
    event: false,
    course: false
  };
  apiLoaded = false;

  center: Position;
  zoom = 17;
  width: number;
  height: number;

  mapOptions: MapOptions;
  safeAreaOptions: SafeAreaOptions;
  obLineOptions: ObLineOptions;
  obAreaOptions: ObAreaOptions;
  hazardAreaOptions: HazardAreaOptions;
  backLineOptions: BackLineOptions;
  frontLineOptions: FrontLineOptions;
  dropZoneOptions: DropZoneOptions;
  mandoOptions: MandoOptions;
  backMarkers: Marker[];
  frontMarkers: Marker[];

  backLines: Line[];
  frontLines: Line[];
  safeAreas: Area[];
  obAreas: Area[];
  obLines: Area[];
  hazardAreas: Area[];
  backTees: MarkerInfo[];
  frontTees: MarkerInfo[];
  dropZones: MarkerInfo[];
  mandos: MarkerInfo[];

  constructor(
    private readonly printService: PrintService,
    private readonly el: ElementRef,
    private readonly remote: RemoteService,
    private readonly googleMapsApi: GoogleMapsApiService,
    route: ActivatedRoute,
  ) {
    this.eventId = route.snapshot.params.eventId;
    this.courseId = route.snapshot.params.courseId;
    this.teeType = route.snapshot.params.teeType || 'back';
  }

  ngOnInit() {
    const element = this.el.nativeElement.querySelector('#app-print-layout');
    const rect = element.getBoundingClientRect();
    this.width = rect.width || 210 * 3;
    this.height = rect.height || 297 * 3;

    this.ssEvent = this.remote.getEvent(this.eventId).subscribe(
      event => this.event = event,
      err => console.log(err),
      () => this.onReady('event')
    );
    this.ssCourse = this.remote.getCourse(this.courseId).subscribe(
      course => this.course = course,
      err => console.log(err),
      () => this.onReady('course')
    );
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
    this.ssEvent?.unsubscribe();
    this.ssMaps?.unsubscribe();
  }

  backTeeOptions(index: string) {
    return {
      draggable: false,
      icon: this.getMarker(Number(index), 'back'),
    };
  }
  frontTeeOptions(index: string) {
    return {
      draggable: false,
      icon: this.getMarker(Number(index), 'front'),
    };
  }

  onIdle() {
    console.log('############### IDLE ############');
  }

  onTilesloaded() {
    console.log('############### onTilesloaded ############');
    setTimeout(() => {
      this.printService.onDataReady();
    }, 60 * 1000);
  }

  private fitBounds(holes: HoleData[]) {
    setTimeout(() => this.layoutmap.fitBounds(new Holes2Bounds(holes).value));
  }

  private getMarker(holeNumber: number, type: TeeType) {
    return (type === 'front' ? this.frontMarkers : this.backMarkers)[holeNumber - 1];
  }

  private onReady(type: 'event' | 'course') {
    this.state[type] = true;
    if (!this.state.event || !this.state.course) {
      return;
    }
    this.ssMaps = this.googleMapsApi.load().pipe(
      tap(() => LoadMapsOptions(this)),
      tap(() => LoadMapsObjects(this, this.course.holes)),
    ).subscribe(() => {
      this.apiLoaded = true;
      this.fitBounds(this.course.holes);
    });
  }
}
