import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ErrorService } from '../errorhandling/error.service';
import { Comment, CItem } from '../shared/models';




@Injectable()
export class CommentService {

    constructor(private http: HttpClient, private errors: ErrorService) { }
    updateComment(comment: Comment) {
        let url = `/frog/comment/${comment.id}/`;
        let options = {
            body: { comment: comment.comment },
            withCredentials: true
        };

        return this.http.put(url, options)
            .map(this.errors.extractValue, this.errors);
    }
    get(item: CItem) {
        let url = '/frog/comment/';
        let params = new HttpParams();
        params = params.append('json', '1');
        params = params.append('guid', item.guid);
        let options = {
            params: params
        };

        return this.http.get(url, options)
            .map(this.errors.extractValues, this.errors);
    }
    add(item: CItem, comment: string) {
        let url = '/frog/comment/';
        let options = {
            body: { comment: comment, guid: item.guid },
            withCredentials: true
        };

        return this.http.post(url, options)
            .map(this.errors.extractValue, this.errors);
    }
}
