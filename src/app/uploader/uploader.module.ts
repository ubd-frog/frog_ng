import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BytesPipe } from './bytes.pipe';
import { UploaderComponent } from './uploader/uploader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BytesPipe, UploaderComponent]
})
export class UploaderModule { }
