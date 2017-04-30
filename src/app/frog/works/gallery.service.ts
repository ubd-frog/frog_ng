import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { extractValues, extractValue } from '../shared/common';
import { Gallery } from '../shared/models';
import { ActivatedRoute} from "@angular/router";
import {ErrorService} from "../errorhandling/error.service";


@Injectable()
export class GalleryService {
    public items: ReplaySubject<Gallery[]>;
    public gallery: ReplaySubject<Gallery>;
    private _items: Gallery[];
    private id: number;

    constructor(private http:Http, private title: Title, private errors: ErrorService) {
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

        this.http.get(url, options).map(this.errors.extractValues, this.errors).subscribe(items => {
            this._items = items;
            this.items.next(this._items);
            if (this.id) {
                this.setGalleryId(this.id);
            }
        }, error => this.errors.handleError(error));
    }
    create(title: string) {
        let url = '/frog/gallery';
        let options = new RequestOptions();
        options.body = {
            title: title,
            security: 1
        };

        options.withCredentials = true;
        return this.http.post(url, options).map(this.errors.extractValue, this.errors);
    }
    add(gallery: Gallery) {
        this._items.push(gallery);
        this.items.next(this._items);
    }
    branding() {
        return this.http.get('/frog/branding').map(this.errors.extractValue, this.errors);
    }
    subscribe(id: number, frequency: number) {
        let url = `/frog/gallery/${id}/subscribe`;
        let options = new RequestOptions();
        options.body = {
            frequency: frequency
        };

        options.withCredentials = true;
        this.http.post(url, options).map(this.errors.extractValue, this.errors).subscribe();
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
