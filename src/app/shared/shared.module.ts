import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MapComponent } from './component/map/map.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [FontAwesomeModule, FormsModule, MapComponent],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
