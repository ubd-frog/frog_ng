import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { extractValues, extractValue } from '../shared/common';
import { Gallery } from '../shared/models';
import { ActivatedRoute} from "@angular/router";


@Injectable()
export class GalleryService {
    public items: ReplaySubject<Gallery[]>;
    public gallery: ReplaySubject<Gallery>;
    private _items: Gallery[];
    private id: number;

    constructor(private http:Http, private title: Title) {
        this._items = [];
        this.items = new ReplaySubject<Gallery[]>();
        this.gallery = new ReplaySubject<Gallery>();
        this.get();
    }
    get() {
        let url = '/frog/gallery';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options).map(extractValues).subscribe(items => {
            this._items = items;
            this.items.next(this._items);
            if (this.id) {
                this.setGalleryId(this.id);
            }
        }, error => console.log(`Could not query Gallery objects: ${error}`));
    }
    create(title: string) {
        let url = '/frog/gallery';
        let options = new RequestOptions();
        options.body = {
            title: title,
            security: 1
        };

        options.withCredentials = true;
        return this.http.post(url, options).map(extractValue);
    }
    add(gallery: Gallery) {
        this._items.push(gallery);
        this.items.next(this._items);
    }
    branding() {
        return this.http.get('/frog/branding').map(extractValue);
    }
    subscribe(id: number, frequency: number) {
        let url = `/frog/gallery/${id}/subscribe`;
        let options = new RequestOptions();
        options.body = {
            frequency: frequency
        };

        options.withCredentials = true;
        this.http.post(url, options).map(extractValue).subscribe();
    }
    setGalleryId(id: number) {
        this.id = id;
        let gallery = this._items.find(g => g.id == id);
        if (gallery) {
            this.gallery.next(gallery);
            this.title.setTitle(gallery.title);
        }
    }
}
