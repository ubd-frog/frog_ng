import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
  imports: [
    CommonModule,
    ViewerRoutingModule
  ],
  declarations: [ViewerComponent]
})
export class ViewerModule { }
