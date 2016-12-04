import { Component, OnInit, Input, AfterContentInit } from '@angular/core';

import { UserService } from '../user/user.service';
import { Comment, User } from './models';
import { CapitalizePipe } from './capitalize.pipe';
import { CommentURLPipe } from './comment-url.pipe';
import { CommentService } from './comment.service';


@Component({
    selector: 'comment-item',
    template: `
    <div class="btn-toolbar" *ngIf="false">
        <div class="btn-group">
            <button class="dropdown-toggle btn btn-default btn-xs" data-toggle="dropdown" href="#" type="button"><i class="fa fa-chevron-down"></i></button>
            <ul class="dropdown-menu dropdown-menu-right dropdown-menu-sm">
                <li><a href="#">Edit</a></li>
            </ul>
        </div>
    </div>
    <div class="comment-body">
        <div class="commenter">
            <a class="light-green-text">{{comment.user?.name | capitalize:1}}</a>
        </div>
        <div class="commenter-headline grey-text text-darken-1">{{comment.user?.email}}</div>
        <i *ngIf="isOwner" (click)="edit()" class="material-icons right pointer" [class.light-green-text]="editing">{{(editing) ? "check_circle" : "edit"}}</i>
        <i *ngIf="editing" (click)="revert()" class="material-icons right red-text pointer">delete_sweep</i>
        
        <div *ngIf="editing">
            <div class="row">
                <div class="input-field">
                    <textarea id="comment" class="materialize-textarea" [(ngModel)]="content"></textarea>
                </div>
            </div>
        </div>
        <div *ngIf="!editing" class="comment-text">
            <p [outerHTML]="comment.comment | commentUrl"></p>
        </div>
        
        <ul class="social-actions">
            <li class="right-align"><i class="posted">{{comment.date | date}}</i></li>
        </ul>
    </div>`,
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
    private user: User
    private isOwner: boolean = false;
    private editing: boolean = false;
    private content: string = '';

    constructor(private service: CommentService, private userservice: UserService) {
        
    }
    ngAfterContentInit() {
        this.userservice.results.subscribe(user => {
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