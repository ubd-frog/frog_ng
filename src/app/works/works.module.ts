import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorksRoutingModule } from './works-routing.module';
import { FilterComponent } from './filter/filter.component';
import { SelectionComponent } from './selection/selection.component';
import { SelectionDetailComponent } from './selection-detail/selection-detail.component';
import { SiteMenuComponent } from './sitemenu/sitemenu.component';
import { WorksComponent } from './works/works.component';
import { WorksListComponent } from './works-list/works-list.component';
import { WorksThumbnailComponent } from './works-thumbnail/works-thumbnail.component';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { TagsModule } from '../tags/tags.module';
import { ReleasenotesModule } from '../releasenotes/releasenotes.module';
import { UploaderModule } from '../uploader/uploader.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ItemDetailModule } from '../item-detail/item-detail.module';
import { WorksService } from './works.service';
import { GalleryService } from './gallery.service';
import { ViewportService } from './viewport.service';
import { SiteconfigComponent } from '../siteconfig/siteconfig/siteconfig.component';

@NgModule({
    imports: [
        CommonModule,
        WorksRoutingModule,

        SharedModule,
        UserModule,
        TagsModule,
        ReleasenotesModule,
        UploaderModule,
        NotificationsModule,
        ItemDetailModule
    ],
    declarations: [FilterComponent, SelectionComponent, SelectionDetailComponent, SiteMenuComponent, WorksComponent, WorksListComponent, WorksThumbnailComponent],
    exports: [SiteMenuComponent],
    providers: [WorksService, GalleryService, ViewportService],
    entryComponents: [SiteconfigComponent]
})
export class WorksModule { }
