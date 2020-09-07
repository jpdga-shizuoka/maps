export interface Environment {
  production: boolean;
  projectPathName: string;
  title: string;
  localize?: {
    distanseFromBackteeToMarker?: string[];
    distanseFromFrontteeToMarker?: string[];
    distanseFromMarkerToGoal?: string[];
  };
}
