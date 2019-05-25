import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { TagsModule } from '../tags/tags.module';
import { RouterModule } from '@angular/router';
import { CommentsModule } from '../comments/comments.module';
import { CropperModule } from '../cropper/cropper.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        SharedModule,
        UserModule,
        TagsModule,
        CommentsModule,
        CropperModule
    ],
    declarations: [ItemDetailComponent],
    exports: [ItemDetailComponent]
})
export class ItemDetailModule { }
