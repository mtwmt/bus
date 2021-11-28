import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusRoutingModule } from './bus-routing.module';
import { BusComponent } from './bus.component';
import { SharedModule } from '../shared/shared.module';
import { BusSearchComponent } from './bus-search/bus-search.component';
import { RouteComponent } from './route/route.component';


@NgModule({
  declarations: [BusComponent, BusSearchComponent, RouteComponent],
  imports: [CommonModule, BusRoutingModule, SharedModule],
})
export class BusModule {}
