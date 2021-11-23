import { LatLng, SelectOptions } from './shared/utils.model';
import { concatMap, map, Observable, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { CountyService } from './shared/service/county.service';
import { LocationService } from './shared/service/location.service';
import { Injectable } from '@angular/core';

export interface AppStates {
  county?: any;
}
const defaultState: AppStates = {};

@Injectable({
  providedIn: 'root',
})
export class AppStore extends ComponentStore<AppStates> {
  constructor(
    private countyService: CountyService,
    private locationService: LocationService
  ) {
    super(defaultState);
  }

  readonly getCounty = this.effect((data$: Observable<any>) => {
    return data$.pipe(
      concatMap(({ location, range }) => {
        return this.countyService.fetchCity().pipe(
          map((counties) => {
            const nearBy = counties.map((list: any) => {
              const districts = list.Districts.map((e: any) => {
                const d = this.locationService.getDistance(location, {
                  PositionLon: e.Longitude,
                  PositionLat: e.Latitude,
                });
                return {
                  ...e,
                  distance: this.locationService.getDistanceUnit(d),
                  now: d < range ? true : false,
                };
              });

              const dist = this.locationService.getDistance(location, {
                PositionLon: list.Longitude,
                PositionLat: list.Latitude,
              });
              return {
                ...list,
                Districts: districts,
                distance: this.locationService.getDistanceUnit(dist),
              };
            });
            return nearBy;
          }),
          tap((data) => {
            this.setCounty(data);
          })
        );
      })
    );
  });

  readonly setCounty = this.updater((satate, county: any[]): AppStates => {
    return {
      ...satate,
      county,
    };
  });

  readonly county$ = this.select(({ county }) => county);

  readonly currCounty$ = this.select(({ county }): SelectOptions => {
    if (!county) {
      return {
        id: '',
        label: '',
      };
    }
    const city = county?.find((el: any) => {
      const filterCity = el.Districts.filter((e: any) => e.now);
      return filterCity.length > 0;
    });

    return (
      this.countyService.setCity(city?.Name) || {
        id: 'NewTaipei',
        label: '新北市',
      }
    );
  });
}
