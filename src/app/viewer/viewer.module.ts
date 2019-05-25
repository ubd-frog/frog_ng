import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { VideoViewerComponent } from './video-viewer/video-viewer.component';
import { MarmosetViewerComponent } from './marmoset-viewer/marmoset-viewer.component';
import { MarzipanoViewerComponent } from './marzipano-viewer/marzipano-viewer.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ItemDetailModule } from '../item-detail/item-detail.module';
import { GroupViewerComponent } from './group-viewer/group-viewer.component';

@NgModule({
    imports: [
        CommonModule,
        ViewerRoutingModule,
        ItemDetailModule,
    ],
    declarations: [ImageViewerComponent, VideoViewerComponent, MarmosetViewerComponent, MarzipanoViewerComponent, GroupViewerComponent, ViewerComponent],
    exports: [ImageViewerComponent, VideoViewerComponent, MarmosetViewerComponent, MarzipanoViewerComponent]
})
export class ViewerModule { }
