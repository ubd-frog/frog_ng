import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientXsrfModule} from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { FrogModule } from './frog/frog.module';


enableProdMode();


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken'
        }),
        ReactiveFormsModule,
        routing,
        FrogModule,
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
