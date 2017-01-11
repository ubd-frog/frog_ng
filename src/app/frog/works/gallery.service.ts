import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { User, Gallery } from '../shared/models';
import { WorksService } from './works.service';


@Injectable()
export class GalleryService {
    public items: ReplaySubject<Gallery[]>;
    private _items: Gallery[];
    
    constructor(private http:Http, private title: Title, private service: WorksService) {
        this._items = [];
        this.items = new ReplaySubject<Gallery[]>();
        this.get();
    }
    get() {
        let url = '/frog/gallery';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options)
            .map(this.extractData).subscribe(items => {
                this._items = items;
                this.items.next(this._items);
                this.service.results.subscribe(items => {
                    this._items.map(item => {
                        if (item.id == this.service.id) {
                            this.title.setTitle(item.title);
                        }
                    });
                });
            }, error => console.log(`Could not query Gallery objects: ${error}`));
    }
    extractData(res: Response) {
        let body = res.json();
        return body.values || [];
    }
    extractValue(res: Response) {
        let body = res.json();
        return body.value || null;
    }
    create(title: string) {
        let url = '/frog/gallery';
        let options = new RequestOptions();
        options.body = {
            title: title,
            security: 1
        }

        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractValue);
    }
    add(gallery: Gallery) {
        this._items.push(gallery);
        this.items.next(this._items);
    }
    branding() {
        return this.http.get('/frog/branding').map(this.extractValue);
    }
}