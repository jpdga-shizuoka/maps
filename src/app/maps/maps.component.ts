import {
  Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, Input, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ResizedEvent } from 'angular-resize-event';
import { Subscription, BehaviorSubject } from 'rxjs';

import {
  TEE_SYMBOL, GOAL_SYMBOL, MANDO_SYMBOL, BACK_MARKERS, DROP_ZONE_SYMBOL, FRONT_MARKERS
} from '../Symbols';
import { Position, HoleMetaData, TeeType } from '../models';
import { CourseService, HoleData, CourseData, CourseId } from '../course-service';
import { HoleInfoSheetComponent } from '../hole-info-sheet/hole-info-sheet.component';
import { holeLength, Path2Bounds } from '../map-utilities';
import { isHandset, Observable, BreakpointObserver } from '../ng-utilities';

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

interface MarkerInfo {
  title: string;
  position: google.maps.LatLng;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googlemap') googlemap: GoogleMap;
  @Input() courseId: CourseId;
  @Input() lastHole = 0;
  @Output() holeClicked = new EventEmitter<HoleMetaData>();
  readonly isHandset$: Observable<boolean>;

  private readonly _course: BehaviorSubject<CourseData>;
  get course() { return this._course.value; }
  set course(course: CourseData) { this._course.next(course); }
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
  backLineOptions = {
    strokeColor: 'white',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    icons: [
      {icon: TEE_SYMBOL, offset: '0%'},
      {icon: GOAL_SYMBOL, offset: '100%'}
    ],
  };
  frontLineOptions = {
    strokeColor: '#a9f5bc',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    icons: [
      {icon: TEE_SYMBOL, offset: '0%'},
      {icon: GOAL_SYMBOL, offset: '100%'}
    ],
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
  dropZoneOptions = {
    draggable: false,
    icon: DROP_ZONE_SYMBOL,
  };
  mandoOptions = {
    draggable: false,
    icon: MANDO_SYMBOL,
  };

  backLines: google.maps.LatLng[][] = [];
  frontLines: google.maps.LatLng[][] = [];
  safeAreas: google.maps.LatLng[][] = [];
  obAreas: google.maps.LatLng[][] = [];
  obLines: google.maps.LatLng[][] = [];
  backTees: MarkerInfo[] = [];
  frontTees: MarkerInfo[] = [];
  dropZones: MarkerInfo[] = [];
  mandos: MarkerInfo[] = [];
  subscription?: Subscription;
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
    private readonly courseService: CourseService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isHandset$ = isHandset(breakpointObserver);
    this._course = new BehaviorSubject<CourseData|undefined>(undefined);
  }

  ngOnInit(): void {
    const element = this.el.nativeElement.querySelector('#googlemap');
    const rect = element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription = this.courseService
    .getCourse(this.courseId)
    .subscribe(
      course => this.course = course,
      err => console.error(err),
      () => {
        this.center = new Holes2Bounds(this.holes).center;
        this.prepareObjectsForMap(this.course.holes);
        const latestHole = this.holes[this.lastHole];
        this.issueEvent(latestHole, latestHole.back ? 'back' : 'front');
      }
    );
  }

  panTo(path: Position[]) {
    this.googlemap.panTo(new google.maps.LatLng(path[0]));
  }

  onMandoClicked(marker: MapMarker, index: number) {
    this.issueEvent(this.getMetadata(marker, index, 'mando'));
  }

  onDropzoneClicked(marker: MapMarker, index: number) {
    this.issueEvent(this.getMetadata(marker, index, 'dz'));
  }

  onBackTeeClicked(marker: MapMarker) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hole => hole.number === holeNumber);
    this.issueEvent(hole, 'back');
  }

  onFrontTeeClicked(marker: MapMarker) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hole => hole.number === holeNumber);
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

  private prepareObjectsForMap(holes: HoleData[]) {
    holes.forEach(hole => {

      if (hole.back) {
        const path: LatLng[] = [];
        hole.back.path.forEach(point => path.push(new google.maps.LatLng(point)));
        this.backLines.push(path);
      }
      if (hole.front) {
        const path: LatLng[] = [];
        hole.front.path.forEach(point => path.push(new google.maps.LatLng(point)));
        this.frontLines.push(path);
      }

      hole.safeAreas?.forEach(area => {
        const safeArea: LatLng[] = [];
        area.forEach(point => safeArea.push(new google.maps.LatLng(point)));
        this.safeAreas.push(safeArea);
      });

      hole.obAreas?.forEach(area => {
        const obArea: LatLng[] = [];
        area.forEach(point => obArea.push(new google.maps.LatLng(point)));
        this.obAreas.push(obArea);
      });

      hole.obLines?.forEach(line => {
        const obLine: LatLng[] = [];
        line.forEach(point => obLine.push(new google.maps.LatLng(point)));
        this.obLines.push(obLine);
      });

      hole.mandos?.forEach(mando => this.mandos.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(mando)
      }));
      hole.dropzones?.forEach(dz => this.dropZones.push({
        title: hole.number.toString(),
        position: new google.maps.LatLng(dz)
      }));

      if (hole.back) {
        const tee = hole.back.path[0];
        this.backTees.push({
          title: hole.number.toString(),
          position: new google.maps.LatLng(tee)
        });
      }
      if (hole.front) {
        const tee = hole.front.path[0];
        this.frontTees.push({
          title: hole.number.toString(),
          position: new google.maps.LatLng(tee)
        });
      }
    });
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

  private issueEvent(data: HoleMetaData | HoleData, type?: TeeType) {
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
    this.panTo(meta.data.path);
    this.isHandset$.subscribe(handset => {
      if (!handset && (meta.teeType === 'dz' || meta.teeType === 'mando')) {
        this.sheet.open(HoleInfoSheetComponent, {data: meta});
      } else {
        this.holeClicked.emit(meta);
      }
    }).unsubscribe();
  }

  private getMetadata(marker: MapMarker, index: number, type: TeeType) {
    const holeNumber = Number(marker.getTitle());
    const hole = this.holes.find(hole => hole.number === holeNumber);
    const markers = type === 'dz' ? this.dropZones : this.mandos;
    const position = markers[index].position;
    const start = {lat: position.lat(), lng: position.lng()};
    const end = hole.back.path[hole.back.path.length - 1];
    const line = [start, end];
    return {
      hole: holeNumber,
      teeType: type,
      description: [''],
      data: {
        path: line,
        length: holeLength(line),
        par: 0
      }
    };
  }

  private getMarker(holeNumber: number, type: TeeType) {
    return (type === 'front' ? FRONT_MARKERS : BACK_MARKERS)[holeNumber - 1];
  }
}

function isHoleData(object: any): object is HoleData {
  return 'number' in object;
}
