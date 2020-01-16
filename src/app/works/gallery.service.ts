import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { first, last } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { Gallery, SiteConfig } from '../shared/models';
import { ErrorService } from '../errorhandling/error.service';
import { SiteConfigService } from '../siteconfig';




@Injectable()
export class GalleryService {
    public items: ReplaySubject<Gallery[]>;
    public gallery: ReplaySubject<Gallery>;

    private _items: Gallery[];
    private id: number;
    private siteconfig: SiteConfig;

    constructor(
        private http: HttpClient,
        private title: Title,
        private errors: ErrorService,
        private siteconfigservice: SiteConfigService
    ) {
        this._items = [];
        this.items = new ReplaySubject<Gallery[]>();
        this.gallery = new ReplaySubject<Gallery>();
        this.get();
    }
    get() {
        let url = '/frog/gallery';
        let params = new HttpParams();
        params = params.append('json', '1');
        params = params.append('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        let galleryreq = this.http.get(url, options)
            .map(this.errors.extractValues, this.errors);

        this.siteconfigservice.get();

        combineLatest(galleryreq, this.siteconfigservice.siteconfig).subscribe(results => {
            this._items = results[0];
            this.siteconfig = results[1];
            this.items.next(this._items);
            if (this.id) {
                this.setGalleryId(this.id);
            }
        }, error => this.errors.handleError(error));
    }
    create(title: string) {
        let url = '/frog/gallery';
        let options = {
            body: {
                title: title,
                security: 1
            },
            withCredentials: true
        };
        return this.http.post(url, options)
            .map(this.errors.extractValue, this.errors);
    }
    add(gallery: Gallery) {
        this._items.push(gallery);
        this.items.next(this._items);
    }
    subscribe(id: number, frequency: number) {
        let url = `/frog/gallery/${id}/subscribe`;
        let options = {
            body: {
                frequency: frequency
            },
            withCredentials: true
        };
        this.http.post(url, options)
            .map(this.errors.extractValue, this.errors).subscribe();
    }
    setGalleryId(id: number) {
        this.id = id;
        let gallery = this._items.find(g => g.id == id);
        if (gallery) {
            this.gallery.next(gallery);
            this.title.setTitle(`${this.siteconfig.name} :: ${gallery.title}`);
        }
    }
}
