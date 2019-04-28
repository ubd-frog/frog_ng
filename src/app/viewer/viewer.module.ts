import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer/viewer.component';
import { ItemDetailModule } from '../item-detail/item-detail.module';
import { ImageViewerModule } from '../image-viewer/image-viewer.module';
import { VideoViewerModule } from '../video-viewer/video-viewer.module';

@NgModule({
    imports: [
        CommonModule,
        ViewerRoutingModule,

        ImageViewerModule,
        VideoViewerModule,
        ItemDetailModule
    ],
    declarations: [ViewerComponent]
})
export class ViewerModule { }
