export interface Environment {
  production: boolean;
  projectPathName: string;
  title: string;
  localize?: {
    distanseFromMarkerToGoal?: string[];
  };
}

export const environment: Environment = {
  production: true,
  projectPathName: '/maps',
  title: 'Caddie Book Japan',
  localize: {
    distanseFromMarkerToGoal: ['a', 'b', 'return b + "からゴールまで" + a'],
  }
};
