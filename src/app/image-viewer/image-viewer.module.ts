import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image/image.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ImageComponent],
    exports: [ImageComponent]
})
export class ImageViewerModule { }
