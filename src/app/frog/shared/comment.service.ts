import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { extractValues, extractValue } from '../shared/common';
import { Comment, IItem } from './models';
import {ErrorService} from "../errorhandling/error.service";

@Injectable()
export class CommentService {

    constructor(private http: Http, private errors: ErrorService) { }
    updateComment(comment: Comment) {
        let url = '/frog/comment/' + comment.id + '/';
        let options = new RequestOptions();

        options.body = {comment: comment.comment};
        options.withCredentials = true;
        return this.http.put(url, options).map(this.errors.extractValue, this.errors);
    }
    get(item:IItem) {
        let url = '/frog/comment/?json=1&guid=' + item.guid;
        return this.http.get(url, null).map(this.errors.extractValues, this.errors);
    }
    add(item:IItem, comment:string) {
        let url = '/frog/comment/';
        let options = new RequestOptions();
        options.body = {comment: comment, guid: item.guid};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.errors.extractValue, this.errors);
    }
}
