import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {SiteConfig} from "./models";
import {ErrorService} from "../errorhandling/error.service";


@Injectable()
export class SiteConfigService {
    public siteconfig: ReplaySubject<SiteConfig>;

    constructor(private http: Http, private errors: ErrorService) {
        this.siteconfig = new ReplaySubject<SiteConfig>();
        this.http.get('/frog/siteconfig').map(this.errors.extractValue, this.errors).subscribe(data => {
            this.siteconfig.next(data);
            this.siteconfig.complete();
        });
    }
}
