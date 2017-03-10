import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';

import { FrogModule } from './frog/frog.module';

enableProdMode();

export function cookieStrategy() {
    return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}

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
            useFactory: cookieStrategy
        }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
