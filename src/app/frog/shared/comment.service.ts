import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { extractValues, extractValue } from '../shared/common';
import { Comment, IItem } from './models';

@Injectable()
export class CommentService {

    constructor(private http: Http) { }
    updateComment(comment: Comment) {
        let url = '/frog/comment/' + comment.id + '/';
        let options = new RequestOptions();

        options.body = {comment: comment.comment};
        options.withCredentials = true;
        return this.http.put(url, options).map(extractValue);
    }
    get(item:IItem) {
        let url = '/frog/comment/?json=1&guid=' + item.guid;
        return this.http.get(url, null).map(extractValues);
    }
    add(item:IItem, comment:string) {
        let url = '/frog/comment/';
        let options = new RequestOptions();
        options.body = {comment: comment, guid: item.guid};
        options.withCredentials = true;
        return this.http.post(url, options).map(extractValue);
    }
}
