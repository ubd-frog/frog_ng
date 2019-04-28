import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperComponent } from './cropper/cropper.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,

        SharedModule
    ],
    declarations: [CropperComponent],
    exports: [CropperComponent]
})
export class CropperModule { }
