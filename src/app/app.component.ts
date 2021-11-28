import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AppStore } from './app.store';
import { LocationService } from './shared/service/location.service';
import { LatLng } from './shared/utils.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private appStore: AppStore,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationService.locations$.subscribe((location: LatLng) => {
      this.appStore.getCounty({ location, range: 3 });
    });
  }
}
