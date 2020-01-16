import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { SiteConfig } from '../shared/models';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class SiteConfigService {
    public siteconfig: ReplaySubject<SiteConfig>;

    constructor(private http: HttpClient, private errors: ErrorService) {
        this.siteconfig = new ReplaySubject<SiteConfig>();
        this.get();
    }

    get() {
        this.http.get('/frog/siteconfig')
            .map(this.errors.extractValue, this.errors)
            .subscribe(data => {
                this.siteconfig.next(data);
            });
    }

    update(siteconfig: SiteConfig, favicon: File = null) {
        let url = '/frog/siteconfig/';
        let options = {
            body: {
                name: siteconfig.name,
                link: siteconfig.link,
                enable_likes: siteconfig.enable_likes,
                default_gallery: siteconfig.default_gallery,
            },
            withCredentials: true
        };

        // Upload images
        if (favicon !== null) {
            const formdata = new FormData();
            formdata.append('favicon', favicon, favicon.name);
            const req = new HttpRequest('POST', url, formdata);
            this.http.request(req)
                .subscribe(siteconfig => {
                    console.log(siteconfig);
                });
        }

        return this.http.post(url, options)
            .map(this.errors.extractValue, this.errors)
            .subscribe(siteconfig => {
                this.siteconfig.next(siteconfig);
            });
    }
}