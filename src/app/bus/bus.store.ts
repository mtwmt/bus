import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { BusService } from './bus.service';

export interface routeInfo {
  city: string;
  filter?: string;
  route?: string;
}
export interface BusStates {
  city?: string;
  route?: string;
  filter?: string;
  busRoute?: any[];
  stopOfRoute?: any[];
  realTimeNearStop?: any[];
  estimatedTimeOfArrival?: any[];
  stationNearBy?: any[];
}

const defaultState: BusStates = {};

@Injectable()
export class BusStore extends ComponentStore<BusStates> {
  constructor(private busService: BusService) {
    super(defaultState);
  }

  readonly getBusRoute = this.effect((info$: Observable<routeInfo>) => {
    return info$.pipe(
      filter(({ city }) => !!city),
      switchMap(({ city }) => {
        return this.busService.fetchBusRoute(city).pipe(
          tap((data: any) => {
            this.setBusRoute(data);
          })
        );
      })
    );
  });

  readonly getBusStopOfRoute = this.effect((info$: Observable<routeInfo>) => {
    return info$.pipe(
      filter(({ city, route }) => !!city && !!route),
      switchMap(({ city, route }) => {
        return this.busService.fetchStopOfRoute(city, route).pipe(
          tap((data: any) => {
            this.setStopOfRoute(data);
          })
        );
      })
    );
  });

  readonly setStopOfRoute = this.updater(
    (satate, stopOfRoute: any[]): BusStates => {
      return {
        ...satate,
        stopOfRoute,
      };
    }
  );

  readonly getRealTimeNearStop = this.effect((info$: Observable<routeInfo>) => {
    return info$.pipe(
      filter(({ city, route }) => !!city && !!route),
      switchMap(({ city, route }) => {
        return this.busService.fetchRealTimeNearStop(city, route).pipe(
          tap((data: any) => {
            this.setRealTimeNearStop(data);
          })
        );
      })
    );
  });

  readonly setRealTimeNearStop = this.updater(
    (satate, realTimeNearStop: any[]): BusStates => {
      return {
        ...satate,
        realTimeNearStop,
      };
    }
  );

  readonly getEstimatedTimeOfArrival = this.effect(
    (info$: Observable<routeInfo>) => {
      return info$.pipe(
        filter(({ city, route }) => !!city && !!route),
        switchMap(({ city, route }) => {
          return this.busService.fetchEstimatedTimeOfArrival(city, route).pipe(
            tap((data: any) => {
              this.setEstimatedTimeOfArrival(data);
            })
          );
        })
      );
    }
  );

  readonly setEstimatedTimeOfArrival = this.updater(
    (satate, estimatedTimeOfArrival: any[]): BusStates => {
      return {
        ...satate,
        estimatedTimeOfArrival,
      };
    }
  );

  readonly setBusRoute = this.updater((satate, busRoute: any[]): BusStates => {
    return {
      ...satate,
      busRoute,
    };
  });

  readonly setFilter = this.updater((satate, filter: string): BusStates => {
    return {
      ...satate,
      filter,
    };
  });

  readonly setCity = this.updater((satate, city: string): BusStates => {
    return {
      ...satate,
      city,
    };
  });

  readonly setRoute = this.updater((satate, route: string): BusStates => {
    return {
      ...satate,
      route,
    };
  });

  readonly busRoute$ = this.select(({ busRoute, filter }) => {
    if (!busRoute) {
      return;
    }

    if (filter) {
      return busRoute.filter((e) => {
        return e.RouteName.Zh_tw.includes(filter);
      });
    }
    return busRoute;
  });

  readonly busStopOfArrival$ = this.select(
    ({
      city,
      route,
      busRoute,
      stopOfRoute,
      estimatedTimeOfArrival,
      realTimeNearStop,
    }) => {
      if (!busRoute && !!city) {
        this.getBusRoute({ city });
      }

      const busHeadsign = this.setBusHeadsign(
        city as string,
        <string>route,
        <[]>busRoute
      );

      const busStopRoute = this.setBusStopRoute(stopOfRoute as []);

      const mergeHeadsignAndStopRoute = this.setMergeHeadsignAndStopRoute(
        busHeadsign,
        busStopRoute
      );

      const routeInfo = this.setRouteInfo(
        mergeHeadsignAndStopRoute,
        estimatedTimeOfArrival as any[],
        realTimeNearStop as any[]
      );
      console.log('busStopOfArrival', busHeadsign);

      return routeInfo;
    }
  );

  setBusHeadsign(city: string, route: string, list: []): any[] {
    return list
      ?.filter((e: any) => e.RouteName.Zh_tw === route)
      .map((e: any) => {
        const newSubRoute = e.SubRoutes?.map((sub: any) => {
          return {
            ...sub,
            Headsign: sub.Direction
              ? e.DestinationStopNameZh + '→' + e.DepartureStopNameZh
              : e.DepartureStopNameZh + '→' + e.DestinationStopNameZh,
          };
        }).map((el: any) => {
          return {
            Direction: el.Direction,
            Headsign: el?.Headsign,
          };
        });
        return newSubRoute;
      })[0];
  }

  setBusStopRoute(list: []) {
    const newList = list?.map((e: any) => {
      const stopList = e.Stops.map((el: any) => {
        return {
          StopUID: el.StopUID,
          StopName: el.StopName.Zh_tw,
        };
      });
      return {
        RouteName: e.RouteName.Zh_tw,
        stopList,
      };
    });
    return newList;
  }

  setMergeHeadsignAndStopRoute(headsign: any[], routeInfo: any[]) {
    if (!headsign || !routeInfo) {
      return [];
    }
    return headsign?.map((e: any, i: number) => {
      return {
        ...e,
        RouteName: routeInfo[i]?.RouteName,
        routeStop: routeInfo[i]?.stopList,
      };
    });
  }

  setRouteInfo(
    mergeHeadsignAndStopRoute: any[],
    estimatedTimeOfArrival: any[],
    realTimeNearStop: any[]
  ) {
    if (!mergeHeadsignAndStopRoute || !estimatedTimeOfArrival) {
      return [];
    }
    const info = mergeHeadsignAndStopRoute?.map((stop: any) => {
      const stopInfo = stop?.routeStop?.map((e: any) => {
        const arriveTime = this.setArriveTime(
          e,
          stop.Direction,
          estimatedTimeOfArrival
        );

        const { EstimateTime, StopStatus }: any = arriveTime || {};

        const plateNumb = this.setBusNearStop(
          e,
          stop.Direction,
          realTimeNearStop
        );
        return {
          ...e,
          plateNumb,
          status: this.getBusArriveTime({
            EstimateTime,
            StopStatus,
          }),
        };
      });

      return {
        ...stop,
        routeStop: stopInfo,
      };
    });
    return info;
  }

  setArriveTime(stop: any, direction: number, estimatedTimeOfArrival: any[]) {
    const arriveTime = estimatedTimeOfArrival.find(
      (el: any) => el.StopUID === stop.StopUID && el.Direction === direction
    );
    if (!arriveTime) {
      return;
    }
    const { EstimateTime, StopStatus } = arriveTime;
    return { EstimateTime, StopStatus };
  }

  setBusNearStop(stop: any, direction: number, realTimeNearStop: any[]) {
    const busNear = realTimeNearStop.find(
      (el: any) => el.StopUID === stop.StopUID && el.Direction === direction
    );

    if (!busNear) {
      return;
    }
    const { PlateNumb } = busNear;
    return PlateNumb;
  }

  getBusArriveTime(info: any) {
    const { EstimateTime, StopStatus } = info;
    if (EstimateTime > 60) {
      return `${Math.floor(EstimateTime / 60)} 分`;
    } else if (EstimateTime > 0 && EstimateTime <= 60) {
      return `進站中`;
    } else if (StopStatus === '3') {
      return '末班駛離';
    } else {
      return '尚未發車';
    }
  }
}
