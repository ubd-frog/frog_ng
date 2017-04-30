import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { extractValues, extractValue } from '../shared/common';
import {IItem, CImage, CVideo, Tag, User, Notification, Gallery} from '../shared/models';
import { NotificationService } from '../notifications/notification.service';
import {GalleryService} from "./gallery.service";
import {PreferencesService} from "../user/preferences.service";
import {ErrorService} from "../errorhandling/error.service";


@Injectable()
export class WorksService {
    private items: IItem[];
    private guids: string[];
    private isLoading: boolean;
    private gallery: Gallery;
    private orderby: string;
    public routecache: string;
    public results: BehaviorSubject<[IItem[], boolean]>;
    public loading: BehaviorSubject<boolean>;
    public id: number;
    public selection: IItem[];
    public terms: Array<Array<any>>;
    public scrollpos: number;
    public minitems: number;

    constructor(
        private http:Http,
        private notify: NotificationService,
        private galleryservice: GalleryService,
        private prefs: PreferencesService,
        private errors: ErrorService
    ) {
        this.items = [];
        this.guids = [];
        this.terms = [];
        this.id = 0;
        this.scrollpos = 0;
        this.orderby = '';
        this.isLoading = false;
        this.results = new BehaviorSubject<[IItem[], boolean]>([this.items, false]);
        this.loading = new BehaviorSubject<boolean>(this.isLoading);
        galleryservice.gallery.subscribe(gallery => this.gallery = gallery);
        prefs.preferences.subscribe(p => {
            if (!this.orderby) {
                this.orderby = p['orderby'];
            }
            else if (p['orderby'] != this.orderby) {
                this.orderby = p['orderby'];
                this.routecache = '';
                this.get();
            }
        });
    }
    get(id:number=0, append:boolean=false) {
        if (window.location.pathname == this.routecache && !append) {
            return;
        }
        this.routecache = window.location.pathname;

        if (id > 0) {
            this.id = id;
        }

        if (!append) {
            this.scrollpos = 0;
        }

        let url = '/frog/gallery/' + this.id + '/filter';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('filters', JSON.stringify(this.terms));
        options.search.set('more', append.toString());
        options.search.set('timestamp', new Date().getTime().toString());

        this.loading.next(true);

        this.http.get(url, options)
            .map(this.errors.extractValues, this.errors).subscribe(items => {
                if (!append) {
                    this.items.length = 0;
                    this.guids.length = 0;
                    this.minitems = items.length;
                }

                for (let item of items) {
                    let obj: IItem;
                    switch(item.guid.charAt(0)) {
                        case '1':
                            obj = <CImage>item;
                            break;
                        case '2':
                            obj = <CVideo>item;
                            break;
                    }
                    if (!obj) {
                        this.errors.clientError(`Item guid was invalid: ${item.guid}`);
                        continue;
                    }

                    obj.author = <User>obj.author;

                    this.items.push(obj);
                    this.guids.push(obj.guid);
                }
                this.results.next([this.items.slice(0), append]);
                this.loading.next(false);
            }, error => this.errors.handleError(error));
    }
    getFromGuid(guid: string) {
        let index = this.guids.indexOf(guid);
        if (index > -1) {
            return this.items[index];
        }
    }
    handleError(error: any) {
        console.error(error);
        return Observable.throw(error);
    }
    reset() {
        this.terms.forEach(element => {
            element.length = 0;
        });
    }
    addTerm(term:any, bucket:number=0, append:boolean=false) {
        term = (parseFloat(term) % 1 === 0) ? parseInt(term) : encodeURIComponent(term);
        if (!append) {
            this.terms[bucket].length = 0;
        }
        if (this.terms[bucket].indexOf(term)) {
            this.terms[bucket].push(term);
        }
    }
    setTerms(terms: any) {
        this.terms = terms;
    }
    likeItem(item:IItem) {
        let url = '/frog/like/' + item.guid;
        this.notify.add(new Notification('Liked', 'thumb_up'));
        this.http.put(url, null).map(this.errors.extractValues, this.errors).subscribe(items => {
            let index = this.guids.indexOf(items[0].guid);
            this.items[index].like_count = items[0].like_count;
        }, error => this.errors.handleError(error));
    }
    update(item: IItem) {
        let url = '/frog/piece/' + item.guid + '/';
        let options = new RequestOptions();

        options.body = {title: item.title, description: item.description};
        options.withCredentials = true;
        this.notify.add(new Notification('Item details updated', 'done'));
        return this.http.put(url, options).map(this.errors.extractValue, this.errors);
    }
    setArtist(items: IItem[], user: User) {
        let url = '/frog/switchartist';
        let options = new RequestOptions();

        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(','),
            artist: user.id
        };
        options.withCredentials = true;
        this.http.post(url, options).map(this.errors.extractValues, this.errors).subscribe(() => {
            items.map(function(_) { _.author = user; });
            this.notify.add(new Notification('New artist set', 'done'));
        }, error => this.errors.handleError(error));
    }
    editTags(items: IItem[], add: Tag[], remove: Tag[]) {
        let url = '/frog/tag/manage';
        let options = new RequestOptions();
        this.notify.add(new Notification('Tags modified', 'label'));

        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(','),
            add: add.map(function(_) { return _.id; }).join(','),
            rem: remove.map(function(_) { return _.id; }).join(',')
        };
        options.withCredentials = true;
        return this.http.post(url, options).map(this.errors.extractValues, this.errors);
    }
    download(items: IItem[]) {
        let url = '/frog/download';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('guids', items.map(function(_) { return _.guid; }).join(','));
        return this.http.get(url, options).map(this.errors.extractValues, this.errors);
    }
    addItems(items: IItem[]) {
        while (items.length > 0) {
            let item = items.pop();
            let index = this.guids.indexOf(item.guid);
            if (index === -1) {
                this.items.splice(0, 0, item);
                this.guids.splice(0, 0, item.guid);
            }
            else {
                this.items[index] = item;
            }
        }
        this.results.next([this.items, false]);
    }
    remove(items: IItem[]) {
        items.forEach(item => {
            let index = this.guids.indexOf(item.guid);
            if (index !== -1) {
                this.items.splice(index, 1);
                this.guids.splice(index, 1);
            }
            this.results.next([this.items, false]);
        });

        let url = '/frog/gallery/' + this.id;
        let options = new RequestOptions();
        options.body = {
            guids: items.map(function(_) { return _.guid; }).join(',')
        };
        options.withCredentials = true;
        this.http.delete(url, options).map(this.errors.extractValues, this.errors).subscribe(null, error => this.errors.handleError(error));
    }
    resolveGuids(guids: string[]) {
        let url = '/frog/p';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('guids', guids.join(','));
        return this.http.get(url, options).map(this.errors.extractValues, this.errors);
    }
    /**
     * Copy or Move items from one gallery to another
     */
    copyItems(guids: string[], copyfrom: number = null, copyTo: number = null) {
        let url = '/frog/gallery/' + (copyTo || this.id);
        let options = new RequestOptions();

        options.body = {guids: guids.join(','), 'from': copyfrom};
        options.withCredentials = true;
        this.loading.next(true);
        this.http.put(url, options).map(this.errors.extractValue, this.errors).subscribe(() => {
            this.resolveGuids(guids).subscribe(items => {
                this.loading.next(false);
                let verb = 'moved';
                if (copyfrom && copyTo) {
                    this.remove(items);
                    verb = 'copied';
                }
                else if (copyTo == null) {
                    this.addItems(items);
                }

                let message = `Items ${verb}! <a href="/w/${copyTo || this.id}">Go There</a>`;
                this.notify.add(new Notification(message));
            });
        }, );
    }
    upload(item: IItem, files: File[], reset: boolean = false) {
        return Observable.create(observer => {
            let fd: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            let url: string = '/frog/piece/' + item.guid + '/';

            if (reset) {
                fd.append('reset-thumbnail', '1');
            }
            else {
                fd.append('file', files[0], files[0].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        observer.next(JSON.parse(xhr.response).value);
                        observer.complete();
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.withCredentials = true;
            xhr.send(fd);
        });
    }
    cropItem(item: IItem, x: number, y: number, width: number, height: number) {
        let url = '/frog/piece/' + item.guid + '/';
        let options = new RequestOptions();

        options.body = {crop: [x, y, width, height]};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.errors.extractValue, this.errors);
    }
}
