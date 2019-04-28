import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BytesPipe } from './bytes.pipe';
import { UploaderComponent } from './uploader/uploader.component';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { TagsModule } from '../tags/tags.module';
import { FormsModule } from '@angular/forms';
import { UploaderService } from './uploader.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        SharedModule,
        UserModule,
        TagsModule
    ],
    declarations: [BytesPipe, UploaderComponent],
    exports: [UploaderComponent],
    providers: [UploaderService]
})
export class UploaderModule { }
