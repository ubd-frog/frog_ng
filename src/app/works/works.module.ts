import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorksRoutingModule } from './works-routing.module';
import { FilterComponent } from './filter/filter.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SelectionComponent } from './selection/selection.component';
import { SelectionDetailComponent } from './selection-detail/selection-detail.component';
import { SiteMenuComponent } from './site-menu/site-menu.component';
import { WorksComponent } from './works/works.component';
import { WorksListComponent } from './works-list/works-list.component';
import { WorksThumbnailComponent } from './works-thumbnail/works-thumbnail.component';
import { SitemenuComponent } from './sitemenu/sitemenu.component';

@NgModule({
  imports: [
    CommonModule,
    WorksRoutingModule
  ],
  declarations: [FilterComponent, NavigationComponent, SelectionComponent, SelectionDetailComponent, SiteMenuComponent, WorksComponent, WorksListComponent, WorksThumbnailComponent, SitemenuComponent]
})
export class WorksModule { }
