import {Injectable} from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Tag } from '../shared/models';
import { WorksService } from '../works/works.service';

@Injectable()
export class TagsService {
    public tags: ReplaySubject<Tag[]>;
    public contentTags: Observable<Tag[]>;
    private _tags: Tag[];
    private _ids: number[];

    constructor(private http:Http, private service: WorksService) {
        this._tags = [];
        this._ids = [];
        this.tags = new ReplaySubject<Tag[]>();
        this.contentTags = this.tags.map(tags => { return tags.filter(tag => !tag.artist)});
        this.get();
    }
    get() {
        this.http.get('/frog/tag/?count=1&cache=' + Date.now())
            .map(this.extractData).subscribe(tags => {
                this._tags = tags;
                this._ids = [];
                for (let tag of tags) {
                    this._ids.push(tag.id);
                }
                this.tags.next(this._tags);
            });
    }
    resolve(name: string) {
        return this.http.get('/frog/tag/resolve/' + name).map(this.extractValue);
    }
    extractData(res: Response) {
        let body = res.json();

        return body.values || [];
    }
    extractValue(res: Response) {
        let body = res.json();

        return body.value || null;
    }
    getTagById(id: number){
        let index = this._ids.indexOf(id);
        if (index !== -1) {
            return this._tags[index];
        }

        return null;
    }
    getTagByName(name: string) {
        for(let tag of this._tags) {
            if (tag.name == name) {
                return tag;
            }
        }

        return null;
    }
    create(name: string) {
        let url = '/frog/tag/';
        let options = new RequestOptions();
        options.body = {name: name};
        options.withCredentials = true;
        let ob = this.http.post(url, options);
        ob.subscribe(res => {
            let data = res.json();
            if (!data.isError) {
                this._tags.push(<Tag>data.value);
                this._ids.push(data.value.id);
            }

        });
        return ob.map(this.extractValue);
    }
    urlForTags(tags: Tag[]) {
        return '/w/' + this.service.id + '/' + tags[0].id;
    }
    merge (ids: number[]) {
        let root = ids.shift();
        let url = `/frog/tag/merge/${root}/`;
        let options = new RequestOptions();

        options.body = {tags: ids}
        this.http.post(url, options).subscribe(() => this.get());
    }
}
