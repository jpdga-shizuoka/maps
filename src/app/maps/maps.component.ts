import {
  Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ResizedEvent } from 'angular-resize-event';
import { BehaviorSubject, Subscription, Observable, of, NEVER } from 'rxjs';
import { take, catchError, map, tap, startWith } from 'rxjs/operators';

import { Position, HoleMetaData, TeeType } from '../models';
import { RemoteService, HoleData, CourseData, CourseId } from '../remote-service';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { holeLength, Path2Bounds } from '../map-utilities';
import { isHandset, BreakpointObserver } from '../ng-utilities';
import { environment } from '../../environments/environment';

type LatLng = google.maps.LatLng;

export { Position };

class Holes2Bounds extends Path2Bounds {
  readonly center: Position;
  constructor(holes: HoleData[]) {
    super();
    holes.forEach(hole => this.addPath(hole.back?.path || hole.front.path));
    this.center = {
      lat: (this.bounds.sw.lat + this.bounds.ne.lat) / 2,
      lng: (this.bounds.sw.lng + this.bounds.ne.lng) / 2
    };
  }
}
class LatLngBounds extends Path2Bounds {
  constructor(path: Position[]) {
    super();
    this.addPath(path);
  }
  get value() {
    const sw = new google.maps.LatLng(this.bounds.sw);
    const ne = new google.maps.LatLng(this.bounds.ne);
    return new google.maps.LatLngBounds(sw, ne);
  }
}

interface MarkerInfo {
  title: string;
  position: google.maps.LatLng;
}

const GOOGLE_MAPS_API = `https://maps.googleapis.com/maps/api/js?key=${environment.googlemaps.apikey}`;
let mapsApiLoaded = false;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {
  @ViewChild('googlemap') googlemap: GoogleMap;
  @Input() lastHole = 1;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  @Input()
  set courseId(courseId: CourseId) { this._courseId.next(courseId); }
  get courseId() { return this._courseId.value; }
  private _courseId = new BehaviorSubject<CourseId|undefined>(undefined);
  readonly isHandset$: Observable<boolean>;
  private ssCourse: Subscription;
  private readonly _course: BehaviorSubject<CourseData>;
  course: CourseData;
  get holes() {return this.course?.holes; }

  center: Position;
  zoom = 17;
  width: number;
  height: number;
  mapOptions = {
    maxZoom: 20,
    minZoom: 17,
    mapTypeId: 'satellite',
    disableDefaultUI: true,
    tilt: 0
  };
  safeAreaOptions = {
    strokeColor: 'green',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: 'green',
    fillOpacity: 0.3
  };
  obLineOptions = {
    strokeColor: 'red',
    strokeOpacity: 0.5,
    strokeWeight: 6,
  };
  obAreaOptions = {
    strokeColor: 'red',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: 'red',
    fillOpacity: 0.3
  };
  hazardAreaOptions = {
    strokeColor: 'purple',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'purple',
    fillOpacity: 0.3
  };
  backLineOptions: {
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    icons: object[];
  };
  frontLineOptions: {
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    icons: object[];
  };
  dropZoneOptions: {
    draggable: boolean;
    icon: object;
  };
  mandoOptions: {
    draggable: boolean;
    icon: object;
  };
  private backMarkers: Object[] = [];
  private frontMarkers: Object[] = [];

  backLines: google.maps.LatLng[][];
  frontLines: google.maps.LatLng[][];
  safeAreas: google.maps.LatLng[][];
  obAreas: google.maps.LatLng[][];
  obLines: google.maps.LatLng[][];
  hazardAreas: google.maps.LatLng[][];
  backTees: MarkerInfo[];
  frontTees: MarkerInfo[];
  dropZones: MarkerInfo[];
  mandos: MarkerInfo[];
  metadata?: HoleMetaData;
  apiLoaded: Observable<boolean>;

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
    private readonly httpClient: HttpClient,
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

    if (mapsApiLoaded) {
      this.loadOptions();
      this.apiLoaded = NEVER.pipe(startWith(true));
      this.ssCourse = this._courseId.subscribe(courseId => this.loadCourse(courseId));
    }
    else {
      this.apiLoaded = this.httpClient.jsonp(GOOGLE_MAPS_API, 'callback')
      .pipe(
        tap(() => mapsApiLoaded = true),
        tap(() => this.loadOptions()),
        tap(() => this.ssCourse = this._courseId.subscribe(courseId => this.loadCourse(courseId))),
        map(() => true),
        catchError(() => of(false)),
      );
    }
  }

  ngOnDestroy() {
    this.ssCourse?.unsubscribe();
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

  private loadOptions() {
    this.backLineOptions = {
      strokeColor: 'white',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {icon: {path: google.maps.SymbolPath.CIRCLE}, offset: '0%'},
        {icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '100%'}
      ],
    };
    this.frontLineOptions = {
      strokeColor: '#a9f5bc',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {icon: {path: google.maps.SymbolPath.CIRCLE}, offset: '0%'},
        {icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '100%'}
      ],
    };
    this.dropZoneOptions = {
      draggable: false,
      icon: {
        url: 'assets/maps/dropzone.svg',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      },
    };
    this.mandoOptions = {
      draggable: false,
      icon: {
        url: 'assets/maps/mandoMarker.svg',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      },
    };

    for (let i = 0; i < 18; ++i) {
      this.backMarkers.push({
        url: `assets/maps/backtee${i+1}.svg`,
        scaledSize: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      });
      this.frontMarkers.push({
        url: `assets/maps/fronttee${i+1}.svg`,
        scaledSize: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12)
      });
    }
  }

  private loadCourse(courseId: CourseId) {
    if (!courseId) { return; }
    this.remote.getCourse(courseId).subscribe(
      course => this.course = course,
      err => console.error(err),
      () => {
        // this.center = new Holes2Bounds(this.holes).center;
        this.prepareObjectsForMap(this.course.holes);
        const latestHole
          = this.holes.find(hole => hole.number === this.lastHole) || this.holes[0];
        this.issueEvent(latestHole, latestHole.back ? 'back' : 'front', true);
      }
    );
  }

  private prepareObjectsForMap(holes: HoleData[]) {
    const backLines: google.maps.LatLng[][] = [];
    const frontLines: google.maps.LatLng[][] = [];
    const safeAreas: google.maps.LatLng[][] = [];
    const obAreas: google.maps.LatLng[][] = [];
    const obLines: google.maps.LatLng[][] = [];
    const hazardAreas: google.maps.LatLng[][] = [];
    const mandos: MarkerInfo[] = [];
    const dropZones: MarkerInfo[] = [];
    const backTees: MarkerInfo[] = [];
    const frontTees: MarkerInfo[] = [];

    holes.forEach(hole => {

      if (hole.back) {
        const path: LatLng[] = [];
        hole.back.path.forEach(point => path.push(new google.maps.LatLng(point)));
        backLines.push(path);
      }
      if (hole.front) {
        const path: LatLng[] = [];
        hole.front.path.forEach(point => path.push(new google.maps.LatLng(point)));
        frontLines.push(path);
      }

      hole.safeAreas?.forEach(area => {
        const safeArea: LatLng[] = [];
        area.forEach(point => safeArea.push(new google.maps.LatLng(point)));
        safeAreas.push(safeArea);
      });

      hole.obAreas?.forEach(area => {
        const obArea: LatLng[] = [];
        area.forEach(point => obArea.push(new google.maps.LatLng(point)));
        obAreas.push(obArea);
      });

      hole.obLines?.forEach(line => {
        const obLine: LatLng[] = [];
        line.forEach(point => obLine.push(new google.maps.LatLng(point)));
        obLines.push(obLine);
      });

      hole.hazardAreas?.forEach(area => {
        const hazardArea: LatLng[] = [];
        area.forEach(point => hazardArea.push(new google.maps.LatLng(point)));
        hazardAreas.push(hazardArea);
      });

      hole.mandos?.forEach(mando => mandos.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(mando)
      }));

      hole.dropzones?.forEach(dz => dropZones.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(dz)
      }));

      if (hole.back) {
        const tee = hole.back.path[0];
        backTees.push({
          title: hole.number.toString(),
          position: new google.maps.LatLng(tee)
        });
      }
      if (hole.front) {
        const tee = hole.front.path[0];
        frontTees.push({
          title: hole.number.toString(),
          position: new google.maps.LatLng(tee)
        });
      }
    });

    this.backLines = backLines;
    this.frontLines = frontLines;
    this.safeAreas = safeAreas;
    this.obAreas = obAreas;
    this.obLines = obLines;
    this.hazardAreas = hazardAreas;
    this.mandos = mandos;
    this.dropZones = dropZones;
    this.backTees = backTees;
    this.frontTees = frontTees;
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
    const goal = hole.back.path[hole.back.path.length - 1];
    const fromMarker = [current, goal];
    const meta = {
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
        meta['fromBacktee'] = {
          path: fromTee,
          length: holeLength(fromTee),
          par: 0
        }
      }
      const fronttee = hole.front?.path[0];
      if (fronttee) {
        const fromTee = [fronttee, current];
        meta['fromFronttee'] = {
          path: fromTee,
          length: holeLength(fromTee),
          par: 0
        }
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
