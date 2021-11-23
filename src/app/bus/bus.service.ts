import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../core/config.service';
import { apiQuery, LatLngRange } from '../shared/utils.model';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  readonly baseUrl =
    this.configService.config.apiUrl +
    this.configService.config.services['bus'];

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  // 取得公車路線
  fetchBusRoute(city: string = '', route: string = '', query?: apiQuery) {
    const url =
      city === 'InterCity'
        ? `${this.baseUrl}/Route/InterCity`
        : `${this.baseUrl}/Route/City/${city}`;

    return this.httpClient.get<any>(url, {
      params: { ...query, $format: 'JSON' },
    });
  }

  // 路線站序資料
  fetchStopOfRoute(city: string = '', route: string = '', query?: apiQuery) {
    const url =
      city === 'InterCity'
        ? `${this.baseUrl}/StopOfRoute/InterCity/${route}`
        : `${this.baseUrl}/StopOfRoute/City/${city}/${route}`;

    return this.httpClient.get<any>(url, {
      params: { ...query, $format: 'JSON' },
    });
  }

  // 取得預估到站資料
  fetchEstimatedTimeOfArrival(
    city: string = '',
    route: string = '',
    query?: apiQuery
  ) {
    const url =
      city === 'InterCity'
        ? `${this.baseUrl}/EstimatedTimeOfArrival/InterCity/${route}`
        : `${this.baseUrl}/EstimatedTimeOfArrival/City/${city}/${route}`;

    return this.httpClient.get<any>(url, {
      params: { ...query, $format: 'JSON' },
    });
  }

  // 目前公車靠近哪個站點
  fetchRealTimeNearStop(
    city: string = '',
    route: string = '',
    query?: apiQuery
  ) {
    const url =
      city === 'InterCity'
        ? `${this.baseUrl}/RealTimeNearStop/InterCity/${route}`
        : `${this.baseUrl}/RealTimeNearStop/City/${city}/${route}`;

    return this.httpClient.get<any>(url, {
      params: { ...query, $format: 'JSON' },
    });
  }

  fetchStationNearBy(position: LatLngRange) {
    const url = `${this.baseUrl}/Station/NearBy`;

    const params = {
      $spatialFilter: `nearby(${position.lat}, ${position.lng}, ${position.distance})`,
    };
    return this.httpClient.get<any>(url, {
      params: { ...params, $format: 'JSON' },
    });
  }
}
