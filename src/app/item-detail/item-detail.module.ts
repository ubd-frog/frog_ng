import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorksDetailComponent } from './works-detail/works-detail.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { TagsModule } from '../tags/tags.module';
import { CommentsModule } from '../comments/comments.module';
import { CropperModule } from '../cropper/cropper.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        SharedModule,
        UserModule,
        TagsModule,
        CommentsModule,
        CropperModule
    ],
    declarations: [WorksDetailComponent],
    exports: [WorksDetailComponent]
})
export class ItemDetailModule { }
