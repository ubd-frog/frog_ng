import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Comment, IItem } from './models';

@Injectable()
export class CommentService {

    constructor(private http: Http) { }
    updateComment(comment: Comment) {
        let url = '/frog/comment/' + comment.id + '/';
        let options = new RequestOptions();
        
        options.body = {comment: comment.comment};
        options.withCredentials = true;
        return this.http.put(url, options).map(this.extractValue);
    }
    get(item:IItem) {
        let url = '/frog/comment/?json=1&guid=' + item.guid;
        return this.http.get(url, null).map(this.extractData);
    }
    add(item:IItem, comment:string) {
        let url = '/frog/comment/';
        let options = new RequestOptions();
        options.body = {comment: comment, guid: item.guid};
        options.withCredentials = true;
        return this.http.post(url, options).map(this.extractValue);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body.values || [];
    }
    private extractValue(res: Response) {
        let body = res.json();
        return body.value || null;
    }
}