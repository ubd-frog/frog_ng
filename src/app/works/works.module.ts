import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorksRoutingModule } from './works-routing.module';
import { FilterComponent } from './filter/filter.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SelectionComponent } from './selection/selection.component';
import { SelectionDetailComponent } from './selection-detail/selection-detail.component';
import { WorksComponent } from './works/works.component';
import { WorksListComponent } from './works-list/works-list.component';
import { WorksThumbnailComponent } from './works-thumbnail/works-thumbnail.component';
import { SiteMenuComponent } from './sitemenu/sitemenu.component';
import { SharedModule } from '../shared/shared.module';
import { TagsModule } from '../tags/tags.module';
import { FormsModule } from '@angular/forms';
import { UserModule } from '../user/user.module';
import { ReleasenotesModule } from '../releasenotes/releasenotes.module';
import { UploaderModule } from '../uploader/uploader.module';
import { ItemDetailModule } from '../item-detail/item-detail.module';
import { SelectionService } from '../shared/selection.service';
import { WorksService } from './works.service';
import { GalleryService } from './gallery.service';
import { SiteConfigService } from '../shared/siteconfig.service';
import { StorageService } from '../shared/storage.service';
import { ViewportService } from './viewport.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        WorksRoutingModule,
        SharedModule,
        TagsModule,
        UserModule,
        ReleasenotesModule,
        UploaderModule,
        ItemDetailModule
    ],
    providers: [WorksService, GalleryService, ViewportService],
    declarations: [FilterComponent, NavigationComponent, SelectionComponent, SelectionDetailComponent, SiteMenuComponent, WorksComponent, WorksListComponent, WorksThumbnailComponent],
    exports: [NavigationComponent]
})
export class WorksModule { }
