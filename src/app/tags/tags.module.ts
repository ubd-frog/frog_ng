import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { FormsModule } from '@angular/forms';
import { TagsService } from './tags.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [TagComponent, TagsListComponent],
    exports: [TagComponent, TagsListComponent],
    providers: [TagsService]
})
export class TagsModule { }
