import {
  Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, Input
} from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ResizedEvent } from 'angular-resize-event';

import {
  TeeSymbol, GoalSymbol, MandoSymbol, BackMarkers, DropZoneSymbol, FrontMarkers
} from '../Symbols';
import { CourseDataSource, HoleInfo } from '../course-datasource';
import { Position } from '../models';

type LatLng = google.maps.LatLng;
type TeeType = 'front' | 'back';

export { Position };
export interface GoogleMapsInfo {
  center: Position;
  zoom: number;
};

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;
  @Input() mapsInfo: GoogleMapsInfo;
  dataSource: CourseDataSource;

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
      {icon: TeeSymbol, offset: '0%'},
      {icon: GoalSymbol, offset: '100%'}
    ],
  };
  frontLineOptions = {
    strokeColor: '#a9f5bc',
    strokeOpacity: 1.0,
    strokeWeight: 4,
    icons: [
      {icon: TeeSymbol, offset: '0%'},
      {icon: GoalSymbol, offset: '100%'}
    ],
  };
  obLineOptions = {
    strokeColor: 'red',
    strokeOpacity: 0.5,
    strokeWeight: 6,
  };
  obAreaOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.3
  };
  dropZoneOptions = {
    draggable: false,
    icon: DropZoneSymbol,
  };
  mandoOptions = {
    draggable: false,
    icon: MandoSymbol,
  };

  holes: HoleInfo[];
  backLines: google.maps.LatLng[][] = [];
  frontLines: google.maps.LatLng[][] = [];
  obAreas: google.maps.LatLng[][] = [];
  obLines: google.maps.LatLng[][] = [];
  backTees: google.maps.LatLng[] = [];
  frontTees: google.maps.LatLng[] = [];
  dropZones: google.maps.LatLng[] = [];
  mandos: google.maps.LatLng[] = [];
  //
  //  for info window
  //
  hole: HoleInfo;
  length: number;
  private teetype: TeeType;
  get holeName() {
    return this.hole?.holeNumber;
  }
  get par() {
    return this.teetype === 'front'
      ? this.hole?.front.par
      : this.hole?.back.par;
  }
  get description() {
    return this.hole?.description;
  }
  get teeType() {
    return this.teetype === 'front' ? 'フロント•ティー' : 'バック•ティー';
  }

  private getHoleNumberFromIndex(index: number, type: TeeType) {
    let hole: HoleInfo;
    let position = 0;

    for (let i = 0; i < this.holes.length; i++) {
      hole = this.holes[i];
      if (hole[type]) {
        position++;
      }
      if (index < position) {
        break;
      }
    }
    return hole.holeNumber;
  }

  private getMarker(index: number, type: TeeType) {
    const holeNumber = this.getHoleNumberFromIndex(index, type);
    return (type === 'front' ? FrontMarkers : BackMarkers)[holeNumber - 1];
  }

  backTeeOptions(index: number) {
    return {
      draggable: false,
      icon: this.getMarker(index, 'back'),
    };
  }
  frontTeeOptions(index: number) {
    return {
      draggable: false,
      icon: this.getMarker(index, 'front'),
    };
  }

  constructor(
    private ngZone: NgZone,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.dataSource = new CourseDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.connect().subscribe(holes => {
      this.holes = holes;
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

        const obArea: LatLng[] = [];
        hole.obAreas?.forEach(area => {
          area.forEach(point => obArea.push(new google.maps.LatLng(point)));
          this.obAreas.push(obArea);
        });

        const obLine: LatLng[] = [];
        hole.obLines?.forEach(line => {
          line.forEach(point => obLine.push(new google.maps.LatLng(point)));
          this.obLines.push(obLine);
        });

        hole.mandos?.forEach(mando => this.mandos.push(new google.maps.LatLng(mando)));
        hole.dropzones?.forEach(zone => this.dropZones.push(new google.maps.LatLng(zone)));

        if (hole.back) {
          const tee = hole.back.path[0];
          this.backTees.push(new google.maps.LatLng(tee));
        }
        if (hole.front) {
          const tee = hole.front.path[0];
          this.frontTees.push(new google.maps.LatLng(tee));
        }
      });
    }).unsubscribe();
  }

  private getHoleFromIndex(index: number, type: TeeType) {
    const holeNumber = this.getHoleNumberFromIndex(index, type);
    return this.holes.find(hole => hole.holeNumber === holeNumber);
  }

  private openHoleDescription(teemarker: MapMarker, index: number, type: TeeType) {
    const hole = this.getHoleFromIndex(index, type);
    this.hole = hole;
    this.teetype = type;
    this.length = type === 'front' ? hole.front?.length : hole.back?.length;
    this.infoWindow.open(teemarker);
  }

  onBackTeeClicked(teemarker: MapMarker, index: number) {
    this.openHoleDescription(teemarker, index, 'back');
  }

  onFrontTeeClicked(teemarker: MapMarker, index: number) {
    this.openHoleDescription(teemarker, index, 'front');
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }
}
