import { NgModule } from '@angular/core';
import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { FrogModule } from './frog/frog.module';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        FrogModule,
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        appRoutingProviders,
        {
            provide: XSRFStrategy,
            useValue: new CookieXSRFStrategy('csrftoken', 'X-CSRFToken')
        }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
