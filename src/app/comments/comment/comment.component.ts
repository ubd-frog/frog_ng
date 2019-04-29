import { Component, Input, AfterContentInit } from '@angular/core';

import { User, Comment } from '../../shared/models';
import { CommentService } from '../comment.service';
import { UserService } from '../../user/user.service';


@Component({
    selector: 'comment-item',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
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
