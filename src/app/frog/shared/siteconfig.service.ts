import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { SiteConfig } from './models';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class SiteConfigService {
    public siteconfig: ReplaySubject<SiteConfig>;

    constructor(private http: HttpClient, private errors: ErrorService) {
        this.siteconfig = new ReplaySubject<SiteConfig>();
        this.http.get('/frog/siteconfig')
            .map(this.errors.extractValue, this.errors)
            .subscribe(data => {
            this.siteconfig.next(data);
            this.siteconfig.complete();
        });
    }
}
