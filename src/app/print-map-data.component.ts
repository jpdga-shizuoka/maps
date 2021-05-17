import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Position, HoleMetaData, TeeType } from './models';
import {
  PrintDataComponent, PrintService, RemoteService, HoleData
} from './print-data.component';
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
} from './maps-options';
import {
  MapsObjects, LoadMapsObjects, Line, Area, MarkerInfo, LatLng
} from './maps-objects';

export { PrintService, RemoteService, HoleData, MarkerInfo, Line, LatLng};

@Component({template: ''})
export class PrintMapDataComponent extends PrintDataComponent
  implements MapsOptions, MapsObjects
{
  center: Position;
  zoom = 16;
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
    remote: RemoteService,
    printService: PrintService,
    route: ActivatedRoute,
  ) {
    super(remote, printService, route);
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

  protected loadMapsOptions() {
    LoadMapsOptions(this);
  }

  protected loadMapsObjects() {
    LoadMapsObjects(this, this.course.holes);
  }

  protected getMarker(holeNumber: number, type: TeeType) {
    return (type === 'front' ? this.frontMarkers : this.backMarkers)[holeNumber - 1];
  }
}
