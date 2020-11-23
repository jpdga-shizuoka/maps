export type DefaultSymbol = object;
export type Icon = DefaultSymbol | {
  offset?: string;
  url?: string;
  scaledSize?: object;
  origin?: object;
  anchor?: object;
};
export type Marker = {
  url: string;
  scaledSize: object;
  origin: object;
  anchor: object;
};
export type MapOptions = {
  maxZoom: number;
  minZoom: number;
  mapTypeId: 'satellite';
  disableDefaultUI: boolean;
  tilt: number;
};
export type SafeAreaOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
};
export type ObLineOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
};
export type ObAreaOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
};
export type HazardAreaOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
};
export type BackLineOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  icons: Icon[];
};
export type FrontLineOptions = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  icons: Icon[];
};
export type DropZoneOptions = {
  draggable: boolean;
  icon: Icon;
};
export type MandoOptions = {
  draggable: boolean;
  icon: Icon;
};
export interface MapsOptions {
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
}

export function LoadMapsOptions(target: MapsOptions) {

  const backMarkers: Marker[] = [];
  const frontMarkers: Marker[] = [];

  for (let i = 0; i < 27; ++i) {
    backMarkers.push({
      url: `assets/maps/backtee${i + 1}.svg`,
      scaledSize: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    });
    frontMarkers.push({
      url: `assets/maps/fronttee${i + 1}.svg`,
      scaledSize: new google.maps.Size(24, 24),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 12)
    });
  }

  Object.assign(target, {
    mapOptions: {
      maxZoom: 20,
      minZoom: 16,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      tilt: 0
    },
    safeAreaOptions: {
      strokeColor: 'green',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: 'green',
      fillOpacity: 0.3
    },
    obLineOptions: {
      strokeColor: 'red',
      strokeOpacity: 0.5,
      strokeWeight: 6,
    },
    obAreaOptions: {
      strokeColor: 'red',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: 'red',
      fillOpacity: 0.3
    },
    hazardAreaOptions: {
      strokeColor: 'purple',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: 'purple',
      fillOpacity: 0.3
    },
    backLineOptions: {
      strokeColor: 'white',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {icon: {path: google.maps.SymbolPath.CIRCLE}, offset: '0%'},
        {icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '100%'}
      ],
    },
    frontLineOptions: {
      strokeColor: '#a9f5bc',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {icon: {path: google.maps.SymbolPath.CIRCLE}, offset: '0%'},
        {icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW}, offset: '100%'}
      ],
    },
    dropZoneOptions: {
      draggable: false,
      icon: {
        url: 'assets/maps/dropzone.svg',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      },
    },
    mandoOptions: {
      draggable: false,
      icon: {
        url: 'assets/maps/mandoMarker.svg',
        scaledSize: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 10)
      },
    },
    backMarkers,
    frontMarkers,
  });
}
