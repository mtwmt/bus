
export interface SelectOptions {
  id: string;
  label: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface apiQuery {
  $select?: string;
  $filter?: string;
  $orderby?: string;
  $top?: number;
  $skip?: string;
}


export interface LatLngRange extends LatLng {
  distance: number;
}
