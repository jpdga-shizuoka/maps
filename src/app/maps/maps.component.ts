import {
  Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ResizedEvent } from 'angular-resize-event';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { Position, HoleMetaData, TeeType } from '../models';
import { RemoteService, HoleData, CourseData, CourseId } from '../remote-service';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { holeLength, LatLngBounds } from '../map-utilities';
import { isHandset, BreakpointObserver } from '../ng-utilities';
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
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent
  implements OnInit, OnDestroy, MapsOptions, MapsObjects {
  @ViewChild('googlemap') googlemap: GoogleMap;
  @Input() lastHole: number;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  @Input()
  set courseId(courseId: CourseId) { this._courseId.next(courseId); }
  get courseId() { return this._courseId.value; }
  private _courseId = new BehaviorSubject<CourseId|undefined>(undefined);
  readonly isHandset$: Observable<boolean>;
  private ssCourse: Subscription;
  private ssMapsApi: Subscription;
  private ssMaps: Subscription;
  private readonly _course: BehaviorSubject<CourseData>;
  apiLoaded = false;
  course: CourseData;
  get holes() {return this.course?.holes; }

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

  metadata?: HoleMetaData;

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

  constructor(
    private readonly sheet: MatBottomSheet,
    private readonly ngZone: NgZone,
    private readonly el: ElementRef,
    private readonly remote: RemoteService,
    private readonly googleMapsApi: GoogleMapsApiService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
    this._course = new BehaviorSubject<CourseData|undefined>(undefined);
  }

  ngOnInit(): void {
    const element = this.el.nativeElement.querySelector('#mapwrapper');
    const rect = element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.ssMaps = this.googleMapsApi.load().pipe(
      tap(() => this.ssCourse = this._courseId.subscribe(courseId => this.loadCourse(courseId))),
      tap(() => LoadMapsOptions(this)),
    ).subscribe(() => this.apiLoaded = true);
  }

  ngOnDestroy() {
    this.ssMapsApi?.unsubscribe();
    this.ssCourse?.unsubscribe();
    this.ssMaps?.unsubscribe();
  }

  panTo(path: Position[]) {
    this.googlemap.panTo(new google.maps.LatLng(path[0]));
  }

  fitBounds(path: Position[]) {
    this.googlemap.fitBounds(new LatLngBounds(path).value);
  }

  onMandoClicked(marker: MapMarker, index: number) {
    this.issueEvent(this.getMetadata(marker, index, 'mando'));
  }

  onDropzoneClicked(marker: MapMarker, index: number) {
    this.issueEvent(this.getMetadata(marker, index, 'dz'));
  }

  onBackTeeClicked(marker: MapMarker) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hl => hl.number === holeNumber);
    this.issueEvent(hole, 'back');
  }

  onFrontTeeClicked(marker: MapMarker) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hl => hl.number === holeNumber);
    this.issueEvent(hole, 'front');
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  onNext(data: HoleMetaData) {
    if (data.teeType === 'back') {
      const currentHole = this.findHole(data);
      if (currentHole.front) {
        this.issueEvent(currentHole, 'front');
        return;
      }
    }
    const nextHole = this.findNext(data);
    this.issueEvent(nextHole, nextHole.back ? 'back' : 'front');
  }

  onPrev(data: HoleMetaData) {
    if (data.teeType === 'front') {
      const currentHole = this.findHole(data);
      if (currentHole.back) {
        this.issueEvent(currentHole, 'back');
        return;
      }
    }
    const prevHole = this.findPrev(data);
    this.issueEvent(prevHole, prevHole.front ? 'front' : 'back');
  }

  private loadCourse(courseId: CourseId) {
    if (!courseId) { return; }
    this.remote.getCourse(courseId).subscribe(
      course => this.course = course,
      err => console.error(err),
      () => {
        // this.center = new Holes2Bounds(this.holes).center;
        LoadMapsObjects(this, this.course.holes);
        const latestHole
          = this.holes.find(hole => hole.number === this.lastHole) || this.holes[0];
        this.issueEvent(latestHole, latestHole.back ? 'back' : 'front', true);
      }
    );
  }

  private findHole(currentHole: HoleMetaData): HoleData {
    const index = this.holes.findIndex(hole => hole.number === currentHole.hole);
    return this.holes[index];
  }

  private findNext(currentHole: HoleMetaData): HoleData {
    let index = this.holes.findIndex(hole => hole.number === currentHole.hole);
    index++;
    index = index >= this.holes.length ? 0 : index;
    return this.holes[index];
  }

  private findPrev(currentHole: HoleMetaData): HoleData {
    let index = this.holes.findIndex(hole => hole.number === currentHole.hole);
    index--;
    index = index < 0 ? this.holes.length - 1 : index;
    return this.holes[index];
  }

  private issueEvent(data: HoleMetaData | HoleData, type?: TeeType, delay = false) {
    let meta: HoleMetaData;
    if (isHoleData(data)) {
      const hole = data as HoleData;
      meta = {
        hole: hole.number,
        teeType: type,
        description: hole.description,
        data: hole[type]
      };
    } else {
      meta = data as HoleMetaData;
    }
    this.metadata = meta;
    this.isHandset$.pipe(take(1)).subscribe(handset => {
      if (!handset) {
        if (meta.teeType === 'dz' || meta.teeType === 'mando') {
          this.sheet.open(HoleInfoSheetComponent, {data: meta});
          this.panTo(meta.data.path);
        } else {
          this.holeClicked.emit(meta);  // issue the event
        }
      }
      if (meta.teeType !== 'dz' && meta.teeType !== 'mando') {
        // and pan to the hole
        if (delay) {
          // any idea?
          setTimeout(() => this.fitBounds(meta.data.path), 1000);
        } else {
          this.fitBounds(meta.data.path);
        }
      }
    });
  }

  private getMetadata(marker: MapMarker, index: number, type: TeeType) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hl => hl.number === holeNumber);
    const markers = type === 'dz' ? this.dropZones : this.mandos;
    const position = markers[index].position;
    const current = {lat: position.lat(), lng: position.lng()};
    const tee = hole.back || hole.front;
    const goal = tee.path[tee.path.length - 1];
    const fromMarker = [current, goal];
    const meta: HoleMetaData = {
      hole: holeNumber,
      teeType: type,
      description: [''],
      data: {
        path: fromMarker,
        length: holeLength(fromMarker),
        par: 0
      }
    };
    if (type === 'mando') {
      const backtee = hole.back?.path[0];
      if (backtee) {
        const fromTee = [backtee, current];
        meta.fromBacktee = {
          path: fromTee,
          length: holeLength(fromTee),
          par: 0
        };
      }
      const fronttee = hole.front?.path[0];
      if (fronttee) {
        const fromTee = [fronttee, current];
        meta.fromFronttee = {
          path: fromTee,
          length: holeLength(fromTee),
          par: 0
        };
      }
    }
    return meta;
  }

  private getMarker(holeNumber: number, type: TeeType) {
    return (type === 'front' ? this.frontMarkers : this.backMarkers)[holeNumber - 1];
  }
}

function isHoleData(object: any): object is HoleData {
  return 'number' in object;
}
