import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs';

import { Result, Tag } from '../shared/models';
import { WorksService } from '../works/works.service';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class TagsService {
    public tags: ReplaySubject<Tag[]>;
    public contentTags: Observable<Tag[]>;
    private _tags: Tag[];
    private _ids: number[];

    constructor(private http:HttpClient, private service: WorksService, private errors: ErrorService) {
        this._tags = [];
        this._ids = [];
        this.tags = new ReplaySubject<Tag[]>();
        this.contentTags = this.tags.map(tags => { return tags.filter(tag => !tag.artist)});
        this.get();
    }
    get() {
        let params = new HttpParams().set('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        this.http.get('/frog/tag/', options)
            .map(this.errors.extractValues, this.errors)
            .subscribe(tags => {
            this._tags = tags;
            this._ids = [];
            for (let tag of tags) {
                this._ids.push(tag.id);
            }
            this.tags.next(this._tags);
        }, error => this.errors.handleError(error));
    }
    getTagWithCount() {
        let params = new HttpParams();
        params = params.append('count', '1');
        params = params.append('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        this.http.get('/frog/tag/', options)
            .map(this.errors.extractValues, this.errors)
            .subscribe(tags => {
            this._tags = tags;
            this._ids = [];
            for (let tag of tags) {
                this._ids.push(tag.id);
            }
            this.tags.next(this._tags);
        }, error => this.errors.handleError(error));
    }
    resolve(name: string) {
        return this.http.get('/frog/tag/resolve/' + name)
            .map(this.errors.extractValue, this.errors);
    }
    getTagById(id: number){
        let index = this._ids.indexOf(id);
        if (index !== -1) {
            return this._tags[index];
        }

        return null;
    }
    getTagByName(name: string) {
        for (let tag of this._tags) {
            if (tag.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
                return tag;
            }
        }

        return null;
    }
    create(name: string) {
        let url = '/frog/tag/';
        let options = {
            body: {name: name},
            withCredentials: true
        };

        let ob = this.http.post(url, options);
        let tagresult = new Subject<Tag>();

        ob.subscribe(res => {
            let result = res as Result;
            if (!result.isError) {
                this._tags.push(<Tag>result.value);
                this._ids.push(result.value.id);
            }
            tagresult.next(result.value);
            tagresult.complete();
        }, error => this.errors.handleError(error));

        return tagresult;
    }
    urlForTags(tags: Tag[]) {
        return '/w/' + this.service.id + '/' + tags[0].id;
    }
    merge (ids: number[]) {
        let root = ids.shift();
        let url = `/frog/tag/merge/${root}/`;
        let options = {
            body: {tags: ids},
            withCredentials: true
        };

        this.http.post(url, options)
            .subscribe(() => this.get(), error => this.errors.handleError(error));
    }
    rename(tag: Tag) {
        let url = `/frog/tag/${tag.id}/`;
        let options = {
            body: {
                name: tag.name,
                artist: tag.artist
            },
            withCredentials: true
        };

        return this.http.put(url, options);
    }
    remove(tag: Tag) {
        let url = `/frog/tag/${tag.id}/`;

        return this.http.delete(url);
    }
}
