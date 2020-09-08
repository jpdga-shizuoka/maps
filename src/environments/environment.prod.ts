import { Environment } from './environment-if';
export { Environment };

export const environment: Environment = {
  production: true,
  projectPathName: '/maps',
  title: 'Caddie Book Japan',
  localize: {
    distanseFromBackteeToMarker: ['a', 'b', 'return "バックティーから" + b + "まで"  + a'],
    distanseFromFrontteeToMarker: ['a', 'b', 'return "フロントティーから" + b + "まで"  + a'],
    distanseFromMarkerToGoal: ['a', 'b', 'return b + "からゴールまで" + a'],
  },
  googlemaps: {
    apikey: 'AIzaSyDfyR-mHrebjYkaU5LCF1HxDO_XWN4IjzA',
  }
};
