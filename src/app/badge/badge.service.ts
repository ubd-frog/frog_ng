import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable, ReplaySubject} from "rxjs";
import {ErrorService} from "../errorhandling/error.service";
import {SiteConfig, Tag} from "../shared/models";


export class Badge {
    id: number;
    tag: Tag;
    image: string;
}


@Injectable({
    providedIn: 'root'
})
export class BadgeService {
    public badges: ReplaySubject<Badge[]>;
    private cache: Badge[];

    constructor(
        private errorservice: ErrorService,
        private http: HttpClient
    ) {
        this.badges = new ReplaySubject<Badge[]>();
        this.cache = [];

        const url = '/frog/badge/';
        this.http.get(url).map(errorservice.extractValues).subscribe(badges => {
            this.cache = badges;
            this.badges.next(this.cache);
        });
    }

    update(tag: string, image: File = null) {
        let url = '/frog/badge/';

        const formdata = new FormData();
        formdata.append('body', JSON.stringify({tag: tag}));
        if (image !== null) {
            formdata.append('image', image, image.name);
        }
        const req = new HttpRequest('POST', url, formdata);
        this.http.request(req)
            .subscribe(res => {
                const result = res as any;
                if (!result.body) {
                    return;
                }
                const badge = result.body.value;
                let found = false;
                for (let i = 0;i<this.cache.length;i++) {
                    if (this.cache[i].id === badge.id) {
                        this.cache[i] = badge;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.cache.push(badge);
                }
                this.badges.next(this.cache);
            });
    }

    getByTag(tag: string) {
        for (let i = 0;i<this.cache.length;i++) {
            if (this.cache[i].tag.name === tag) {
                return this.cache[i];
                break;
            }
        }

        return null;
    }
}
