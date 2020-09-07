// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment-if';
export { Environment };

export const environment: Environment = {
  production: false,
  projectPathName: '',
  title: 'Caddie Book Japan',
  localize: {
    distanseFromBackteeToMarker: ['a', 'b', 'return "バックティーから" + b + "まで"  + a'],
    distanseFromFrontteeToMarker: ['a', 'b', 'return "フロントティーから" + b + "まで"  + a'],
    distanseFromMarkerToGoal: ['a', 'b', 'return b + "からゴールまで" + a'],
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
