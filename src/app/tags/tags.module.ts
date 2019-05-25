import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { ManageTagsDialogComponent } from './manage-tags-dialog/manage-tags-dialog.component';
import { RecentTagsComponent } from './recent-tags/recent-tags.component';
import { AritstTagPipe } from './aritst-tag.pipe';
import { FormsModule } from '@angular/forms';
import { TagsService } from './tags.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [TagComponent, ManageTagsDialogComponent, RecentTagsComponent, AritstTagPipe],
    exports: [TagComponent, ManageTagsDialogComponent, RecentTagsComponent, AritstTagPipe],
    providers: [TagsService]
})
export class TagsModule { }
