import { AppStore } from './../app.store';
import {
  AfterViewInit,
  Component,
  Injectable,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BusService } from './bus.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SelectOptions } from '../shared/utils.model';
import { CountyService } from '../shared/service/county.service';
import { BusStore } from './bus.store';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
  providers: [BusStore],
})
export class BusComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject();

  public countySelectOption = this.countyService.fetchCountySelectOption();
  public defaultCity: string = '';
  public searchRoute: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private busStore: BusStore,
    public appStore: AppStore,
    private countyService: CountyService
  ) {}

  ngOnInit(): void {
    this.subscribeUrl();
  }

  ngAfterViewInit(): void {
    if (!this.defaultCity) {
      this.subscribeCurrCounty();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  subscribeUrl(): void {
    this.activatedRoute.queryParams
      .pipe(
        map((params: Params) => {
          return {
            filter: params['filter'],
            city: params['city'],
          };
        })
      )
      .subscribe(({ filter, city }) => {
        this.searchRoute = filter;
        this.busStore.setCity(city);
        this.defaultCity = city;
      });
  }

  subscribeCurrCounty() {
    this.appStore.currCounty$
      .pipe(
        takeUntil(this.onDestroy$),
        filter((v) => !!v.id)
      )
      .subscribe((city: SelectOptions) => {
        this.defaultCity = city.id;
        this.router.navigate([], {
          queryParams: {
            city: city.id,
          },
        });
        this.busStore.setCity(city.id);


      });
  }

  onCountyChange(event: string) {
    const city = event;
    this.router.navigate(['search'], {
      queryParams: {
        city,
      },
    });
  }

  onSearch() {
    console.log('onSearch');
    this.router.navigate(['search'], {
      queryParams: {
        filter: this.searchRoute,
        direction: 0,
      },
    });
  }
}
