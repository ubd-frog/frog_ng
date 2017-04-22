import { Component, OnInit, Input, AfterContentInit } from '@angular/core';

import { UserService } from '../user/user.service';
import { Comment, User } from './models';
import { CapitalizePipe } from './capitalize.pipe';
import { CommentURLPipe } from './comment-url.pipe';
import { CommentService } from './comment.service';


@Component({
    selector: 'comment-item',
    templateUrl: './html/comment.html',
    styles: [
        '.comment-body { position: relative; width: 100%; overflow: visible; vertical-align: top; line-height: initial; }',
        '.comment-body .commenter a { font-size: 16px; font-weight: 300; }',
        '.comment-body .commenter-headline { font-size: 12px; opacity: 0.6; margin-bottom: 5px; line-height: 1.25em; }',
        '.comment-text { word-break: break-word; }',
        '.social-actions { margin: 5px 0; padding: 0; list-style: none; }',
        '.social-actions li { display: inline-block; margin-right: 15px; font-size: 12px; float: right; }',
        'div.commenter a { line-height: inherit; font-size: 20px; padding: 0; height: inherit; }',
        'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        'p { margin: 0; }',
        'i.pointer { cursor: pointer; }',
        'textarea { border: none; border-left: 4px solid #4caf50; outline: none; transition: height 500ms; background-color: #1b1b1b; }',
        'textarea.expanded { height: 100px; }',
        'textarea::-webkit-input-placeholder { color: #707070; }',
        '.input-field { margin-top: 2rem; }'
    ]
})
export class CommentComponent implements AfterContentInit {
    @Input() comment: Comment;

    private user: User;
    public content: string = '';
    public isOwner: boolean = false;
    public editing: boolean = false;

    constructor(private service: CommentService, private userservice: UserService) {

    }
    ngAfterContentInit() {
        this.userservice.user.subscribe(user => {
            this.user = user;
            this.isOwner = user.id == this.comment.user.id;
        });
    }
    edit() {
        if (this.editing) {
            this.comment.comment = this.content;
            this.service.updateComment(this.comment).subscribe(comment => this.comment = comment);
        }
        else {
            this.content = this.comment.comment;
        }
        this.editing = !this.editing;
    }
    revert() {
        this.content = '';
        this.editing = false;
    }
}
