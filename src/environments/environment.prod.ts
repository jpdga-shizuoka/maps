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
  title: 'アプリ名未だ決まらず',
  localize: {
    distanseFromMarkerToGoal: ['a', 'b', 'return b + "からゴールまで" + a'],
  }
};
