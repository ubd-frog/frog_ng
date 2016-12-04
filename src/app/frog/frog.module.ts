import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { WorksComponent } from './works/works.component';
import { WorksListComponent } from './works/works-list.component';
import { WorksThumbnailComponent } from './works/works-thumbnail.component';
import { SelectionDetailComponent } from './works/selection-detail.component';
import { NavigationComponent } from './works/navigation.component';
import { FilterComponent } from './works/filter.component';
import { SelectionComponent } from './works/selection.component';
import { WorksService } from './works/works.service';
import { GalleryService } from './works/gallery.service';
import { ViewportService } from './works/viewport.service';
import { worksRouting } from './works/works.routing';

import { CapitalizePipe } from './shared/capitalize.pipe';
import { TagArtistFilterPipe } from './shared/tag-artist-filter.pipe';
import { CommentURLPipe } from './shared/comment-url.pipe';
import { TagsComponent } from './shared/tags.component';
import { WorksDetailComponent } from './shared/works-detail.component';
import { AutocompleteComponent } from './shared/autocomplete.component';
import { CommentComponent } from './shared/comment.component';
import { TagsService } from './shared/tags.service';
import { SelectionService } from './shared/selection.service';
import { CommentService } from './shared/comment.service';
import { StorageService } from './shared/storage.service';

import { ViewerComponent } from './viewer/viewer.component';
import { ImageComponent } from './viewer/image.component';
import { VideoComponent } from './viewer/video.component';
import { viewerRouting } from './viewer/viewer.routing';

import { LoginComponent } from './user/login.component';
import { LogoutComponent } from './user/logout.component';
import { PreferencesComponent } from './user/preferences.component';
import { UserInputComponent } from './user/userinput.component';
import { UserService } from './user/user.service';
import { PreferencesService } from './user/preferences.service';
import { LoggedInGuard } from './user/loggedin.guard';
import { userRouting } from './user/user.routing';

import { UploaderComponent } from './uploader/uploader.component';
import { UploaderService } from './uploader/uploader.service';

import { NotificationService } from './notifications/notification.service';
import { NotificationListComponent } from './notifications/notification-list.component';
import { NotificationComponent } from './notifications/notification.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        worksRouting,
        viewerRouting,
        userRouting
    ],
    declarations: [
        WorksComponent,
        WorksListComponent,
        WorksThumbnailComponent,
        WorksDetailComponent,
        NavigationComponent,
        FilterComponent,
        SelectionComponent,

        TagsComponent,
        SelectionDetailComponent,
        AutocompleteComponent, 
        CommentComponent,
        CommentURLPipe,
        CapitalizePipe, 
        TagArtistFilterPipe, 

        ViewerComponent,
        ImageComponent,
        VideoComponent,

        UploaderComponent,

        NotificationListComponent,
        NotificationComponent,

        PreferencesComponent,
        UserInputComponent,

        LoginComponent,
        LogoutComponent
    ],
    providers: [
        WorksService,
        GalleryService,
        ViewportService,
        TagsService,
        SelectionService,
        CommentService,
        UploaderService,
        StorageService,
        NotificationService,
        UserService,
        PreferencesService,
        LoggedInGuard
    ]
})
export class FrogModule {}
