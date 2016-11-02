import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorksComponent } from './works.component';
import { WorksListComponent } from './works-list.component';
import { WorksThumbnailComponent } from './works-thumbnail.component';
import { WorksDetailComponent } from './works-detail.component';
import { NavigationComponent } from './navigation.component';
import { WorksService } from './works.service';
import { worksRouting, worksRoutingProviders } from './works.routing';

import { FilterComponent } from './filter.component';
import { SelectionComponent } from './selection.component';
import { GalleryService } from './gallery.service';

import { TagsComponent, TagsService, SelectionService, SelectionDetailComponent, CapitalizePipe, TagArtistFilterPipe, AutocompleteComponent, CommentComponent } from '../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        worksRouting
    ],
    declarations: [
        WorksComponent,
        WorksThumbnailComponent,
        WorksListComponent,
        WorksDetailComponent,
        NavigationComponent,
        FilterComponent,
        TagsComponent,
        SelectionComponent,
        SelectionDetailComponent,
        CapitalizePipe,
        TagArtistFilterPipe,
        AutocompleteComponent,
        CommentComponent
    ],
    providers: [
        WorksService,
        TagsService,
        SelectionService,
        GalleryService
    ]
})
export class WorksModule {}
