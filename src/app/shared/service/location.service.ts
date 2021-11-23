import { Injectable } from '@angular/core';
import { catchError, concatMap, map, Observable } from 'rxjs';
import { LatLng, SelectOptions } from '../utils.model';
import { CountyService } from './county.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private countyService: CountyService) {}

  locations$ = new Observable<LatLng>((observer) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          alert('請開啟定位');
          console.log(error);
          observer.error(error);
        }
      );
    } else {
      observer.error('Geolocation not available');
      alert('不支援定位');
    }
  });

  fetchCity(range: number = 3) {
    return this.locations$.pipe(
      concatMap((location: any) => {
        return this.countyService.fetchCity().pipe(
          map((counties) => {
            const nearBy = counties.map((list: any) => {
              const districts = list.Districts.map((e: any) => {
                const d = this.getDistance(location, {
                  PositionLon: e.Longitude,
                  PositionLat: e.Latitude,
                });
                return {
                  ...e,
                  distance: this.getDistanceUnit(d),
                  now: d < range ? true : false,
                };
              });

              const dist = this.getDistance(location, {
                PositionLon: list.Longitude,
                PositionLat: list.Latitude,
              });
              return {
                ...list,
                Districts: districts,
                distance: this.getDistanceUnit(dist),
              };
            });
            return nearBy;
          })
        );
      }),
      catchError(() => {
        return this.countyService.fetchCity();
      })
    );
  }

  getDistance(
    userLocation: { lat: number; lng: number },
    position: { PositionLon: number; PositionLat: number }
  ) {
    const EARTH_RADIUS = 6378.137;
    const userLatitude = userLocation.lat;
    const userLongitude = userLocation.lng;

    const storeLatitude = position.PositionLat;
    const storeLongitude = position.PositionLon;

    const dLat = ((storeLongitude - userLongitude) * Math.PI) / 180;
    const dLon = ((storeLatitude - userLatitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLatitude * Math.PI) / 180) *
        Math.cos((storeLatitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = EARTH_RADIUS * c;
    return d;
  }

  getDistanceUnit(d: number) {
    return d > 1 ? d.toFixed(2) + 'km' : Math.round(d * 1000) + 'm';
  }


}
