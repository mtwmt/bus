import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusSearchComponent } from './bus-search/bus-search.component';
import { BusComponent } from './bus.component';
import { RouteComponent } from './route/route.component';

const routes: Routes = [
  {
    path: '',
    component: BusComponent,
    children: [
      {
        path: 'search',
        component: BusSearchComponent,
      },
      {
        path: 'route',
        component: RouteComponent,
      },
      {
        path: '**',
        redirectTo: 'search',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusRoutingModule { }
