import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/config.service';
import { SelectOptions } from '../utils.model';

export enum County {
  InterCity = '公路客運',
  Taipei = '臺北市',
  NewTaipei = '新北市',
  Taoyuan = '桃園市',
  Taichung = '臺中市',
  Tainan = '臺南市',
  Kaohsiung = '高雄市',
  Keelung = '基隆市',
  Hsinchu = '新竹市',
  HsinchuCounty = '新竹縣',
  MiaoliCounty = '苗栗縣',
  ChanghuaCounty = '彰化縣',
  NantouCounty = '南投縣',
  YunlinCounty = '雲林縣',
  ChiayiCounty = '嘉義縣',
  Chiayi = '嘉義市',
  PingtungCounty = '屏東縣',
  YilanCounty = '宜蘭縣',
  HualienCounty = '花蓮縣',
  TaitungCounty = '臺東縣',
  KinmenCounty = '金門縣',
  PenghuCounty = '澎湖縣',
  LienchiangCounty = '連江縣',
}

export enum CityCode {
  THB = 'InterCity',
  TPE = 'Taipei',
  NWT = 'NewTaipei',
  TAO = 'Taoyuan',
  TXG = 'Taichung',
  TNN = 'Tainan',
  KHH = 'Kaohsiung',
  KEE = 'Keelung',
  HSZ = 'Hsinchu',
  HSQ = 'HsinchuCounty',
  MIA = 'MiaoliCounty',
  CHA = 'ChanghuaCounty',
  NAN = 'NantouCounty',
  YUN = 'YunlinCounty',
  CYQ = 'ChiayiCounty',
  CYI = 'Chiayi',
  PIF = 'PingtungCounty',
  ILA = 'YilanCounty',
  HUA = 'HualienCounty',
  TTT = 'TaitungCounty',
  KIN = 'KinmenCounty',
  PEN = 'PenghuCounty',
  LIE = 'LienchiangCounty',
}

@Injectable({
  providedIn: 'root',
})
export class CountyService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  setCity(city: string): SelectOptions {
    const currCity: any = Object.entries(County).find(([en, cn]) => {
      return cn === city || en === city;
    });
    return {
      id: currCity[0],
      label: currCity[1],
    };
  }

  fetchCountySelectOption(): SelectOptions[] {
    return Object.entries(County).map((item) => {
      return {
        id: item[0],
        label: item[1],
      };
    });
  }

  fetchCity() {
    const url = `${this.configService.config.assetsUrl}/counties.json`;
    return this.httpClient.get<any>(url).pipe(
      map((res) => {
        return res
          .map((e: any) => {
            return {
              ...e,
              Districts: e.Districts.sort((a: any, b: any) => a.Sort - b.Sort),
            };
          })
          .sort((a: any, b: any) => a.Sort - b.Sort);
      })
    );
  }
}
