import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientXsrfModule, HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import { AppComponent } from './app.component';

import { WorksModule } from './works/works.module';
import { ViewerModule } from './viewer/viewer.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { LoggedInGuard } from './user/loggedin.guard';
import { FrogAppRoutingModule } from './app-routing.module';
import { ErrorhandlingModule } from './errorhandling/errorhandling.module';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        ReactiveFormsModule,
        NoopAnimationsModule,

        SharedModule,
        WorksModule,
        ViewerModule,
        UserModule,
        ErrorhandlingModule,
        FrogAppRoutingModule,
    ],
    declarations: [
        AppComponent
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
