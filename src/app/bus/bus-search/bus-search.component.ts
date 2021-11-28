import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Observable, map, distinctUntilChanged } from 'rxjs';
import { BusStore } from '../bus.store';

@Component({
  selector: 'app-bus-search',
  templateUrl: './bus-search.component.html',
  styleUrls: ['./bus-search.component.scss'],
})
export class BusSearchComponent implements OnInit {
  private urlParams$: Observable<any> = this.activatedRoute.queryParamMap.pipe(
    map((params: Params) => {
      return {
        city: params['get']('city'),
        filter: params['get']('filter'),
        route: params['get']('route'),
        direction: params['get']('direction') || 0,
      };
    })
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public busStore: BusStore
  ) {}

  ngOnInit(): void {
    this.urlParams$
      .pipe(
        distinctUntilChanged(
          (p, q) => p.city === q.city && p.filter === q.filter
        )
      )
      .subscribe(({ city, filter }) => {
        this.busStore.getBusRoute({ city, filter });
        this.busStore.setFilter(filter);
      });


  }

  onChangeRoute(route: string) {
    console.log('route', route);
    this.router.navigate(['route'], {
      queryParams: {
        route,
        direction: 0,
      },
      queryParamsHandling: 'merge',
    });
  }
}
