import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientXsrfModule, HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import { AppComponent } from './app.component';

import { CommentsModule } from './comments/comments.module';
import { CropperModule } from './cropper/cropper.module';
import { ErrorhandlingModule } from './errorhandling/errorhandling.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReleasenotesModule } from './releasenotes/releasenotes.module';
import { SharedModule } from './shared/shared.module';
import { TagsModule } from './tags/tags.module';
import { UploaderModule } from './uploader/uploader.module';
import { UserModule } from './user/user.module';
import { ViewerModule } from './viewer/viewer.module';
import { WorksModule } from './works/works.module';
import { ItemDetailModule } from './item-detail/item-detail.module';
import { FrogAppRoutingModule } from './app-routing.module';
import { WorksRoutingModule } from './works/works-routing.module';
import { UserRoutingModule } from './user/user-routing.module';
import { ViewerRoutingModule } from './viewer/viewer-routing.module';


enableProdMode();


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        ReactiveFormsModule,
        BrowserAnimationsModule,

        FrogAppRoutingModule,
        WorksRoutingModule,
        UserRoutingModule,
        ViewerRoutingModule,

        CommentsModule,
        CropperModule,
        ErrorhandlingModule,
        GroupsModule,
        NotificationsModule,
        ReleasenotesModule,
        SharedModule,
        TagsModule,
        UploaderModule,
        UserModule,
        ViewerModule,
        WorksModule,
        ItemDetailModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
