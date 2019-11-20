import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortablejsModule } from 'angular-sortablejs';
import { MatButtonModule } from '@angular/material';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupEditorComponent } from './group-editor/group-editor.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupThumbnailComponent } from './group-thumbnail/group-thumbnail.component';
import { FormsModule } from '@angular/forms';
import { TagsModule } from '../tags/tags.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { WorksModule } from '../works/works.module';
import { CropperModule } from '../cropper/cropper.module';
import { UploaderModule } from '../uploader/uploader.module';
import { ViewerModule } from '../viewer/viewer.module';
import { GroupService } from './group.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SortablejsModule,

        MatButtonModule,

        GroupsRoutingModule,
        SharedModule,
        TagsModule,
        UserModule,
        WorksModule,
        CropperModule,
        UploaderModule,
        ViewerModule
    ],
    declarations: [GroupEditorComponent, GroupListComponent, GroupThumbnailComponent],
    providers: [GroupService]
})
export class GroupsModule { }
