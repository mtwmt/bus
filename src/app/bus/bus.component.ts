import { AppStore } from './../app.store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BusService } from './bus.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectOptions } from '../shared/utils.model';
import { CountyService } from '../shared/service/county.service';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
})
export class BusComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject();

  public countySelectOption = this.countyService.fetchCountySelectOption();
  public defaultCity: string = '';
  public searchRoute: string = '';

  constructor(
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public appStore: AppStore,
    private countyService: CountyService
  ) {}

  ngOnInit(): void {
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
        console.log('city', city);
      });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // this.onDestroy$.next(null);
    this.onDestroy$.complete();
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
      queryParamsHandling: 'merge',
    });
  }
}
