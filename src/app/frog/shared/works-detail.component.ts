import { Component, Input, OnInit, OnDestroy, AfterContentInit, HostListener, trigger, state, style, transition, animate } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user/user.service';
import { WorksService } from '../works/works.service';
import { IItem, Tag, User } from '../shared/models';
import { CapitalizePipe } from '../shared/capitalize.pipe';
import { TagArtistFilterPipe } from '../shared/tag-artist-filter.pipe';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { TagsComponent } from '../shared/tags.component';
import { CommentComponent } from '../shared/comment.component';
import { CommentService } from '../shared/comment.service';
import { TagsService } from '../shared/tags.service';
import { SelectionService } from '../shared/selection.service';

@Component({
    selector: 'works-detail',
    template: `
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey lighten-4-text">
        <div *ngIf="item" class="works-detail grey-text text-lighten-1">
            <i (click)="toggle()" class="material-icons right">close</i>
            <i *ngIf="!isOwner" (click)="edit()" class="material-icons right" [class.light-green-text]="editing">{{(editing) ? "check_circle" : "edit"}}</i>
            <i *ngIf="editing" (click)="revert()" class="material-icons right red-text">cancel</i>
            <div *ngIf="editing">
                <li class="stack">
                    <img src="{{item.thumbnail}}" width="128" />
                </li>
                <div class="file-field input-field">
                    <a class="waves-effect waves-light btn red darken-4"><i (click)="resetThumbnail()" class="material-icons">close</i></a>
                    <div class="btn">
                        <span>File</span>
                        <input type="file" ([ngModel])="customThumbnail" >
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text">
                    </div>
                </div>
            </div>
            
            <div class="artwork-info ps-container">
                <div class="separator-sm"></div>
                <div class="artist">
                    <div class="artist-name-and-headline">
                        <div class="name">
                            <a href="/w/1/1">{{item.author.name | capitalize:1}}</a>
                        </div>
                        <div class="headline">{{item.author.email}}</div>
                    </div>
                </div>
                <div class="button-blocks">
                    <div class="separator"></div>
                    <div class="row">
                        <div class="col s6">
                            <a (click)="like()" class="waves-effect waves-light btn green"><i class="material-icons left">thumb_up</i> Like</a>
                        </div>
                        <div class="col s6">
                            <a class="waves-effect waves-light btn blue"><i class="material-icons left">collections</i> Add to Collection</a>
                        </div>
                    </div>
                </div>
            </div>

            <h3 *ngIf="!editing" class="white-text">{{item.title}}</h3>
            <div *ngIf="editing" class="row">
                <div class="input-field">
                    <input id="title" type="text" [(ngModel)]="title" />
                    <label class="active" for="title">Title</label>
                </div>
            </div>

            <div *ngIf="!editing" class="description" id="project-description" style="max-height: none;">
                <p>{{item.description}}</p>
            </div>
            <div *ngIf="editing">
                <div class="row">
                    <div class="input-field">
                        <textarea id="description" class="materialize-textarea" [(ngModel)]="description"></textarea>
                        <label class="active" for="description">Description</label>
                    </div>
                </div>
            </div>

            <small><i>{{item.created | date}}</i></small>
            <div class="separator-sm"></div>
            <ul class="list-inline">
                <li>
                    <i class="material-icons tiny">thumb_up</i> {{item.like_count}} Likes
                </li>
                <li>
                    <i class="material-icons tiny">comment</i> {{item.comment_count}} Comments
                </li>
            </ul>
            <div class="separator"></div>
            <div class="tags">
                <h4 class="title">
                    <i class="material-icons green-text">label</i> Tags
                </h4>
                <tag *ngFor="let tag of item.tags | tagArtistFilter" [item]="tag.id" [dark]="true" (onClose)="removeTag($event)" (onClick)="navigateToTag(tag)"></tag>
                <autocomplete (onSelect)="addTag($event)"></autocomplete>
            </div>
            <div class="separator"></div>
            <div class="keyboard-shortcuts hidden-xs hidden-sm">
                <h4 class="title">
                    <i class="material-icons green-text">info</i> Details
                </h4>
                <table>
                    <tbody>
                        <tr><td>Created</td><td>{{item.created | date:'short'}}</td></tr>
                        <tr><td>Modified</td><td>{{item.modified | date:'short'}}</td></tr>
                        <tr><td>Dimensions</td><td>{{item.width}} x {{item.height}}</td></tr>
                        <tr><td>GUID</td><td>{{item.guid}}</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="separator"></div>
            <h4>
                <i class="material-icons green-text">comment</i> {{item.comment_count}} Comments
            </h4>
            <ul>
                <li *ngFor="let comment of comments"><comment-item [comment]="comment"></comment-item></li>
            </ul>
            <input type="text" placeholder="Add a comment..." *ngIf="!prompted" (focus)="prompted = true" />
            <div *ngIf="prompted">
                <textarea [(ngModel)]=comment (focus)="true" (keydown)="$event.stopPropagation()"></textarea>
                <div class="row">
                    <div class="col s6"><a class="waves-effect waves-light light-green btn" (click)="postComment()">Post comment</a></div>
                    <div class="col s6"><a class="waves-effect waves-light red btn" (click)="prompted = false">Cancel</a></div>
                </div>
            </div>
            <div class="keyboard-shortcuts hidden-xs hidden-sm">
                <hr>
                <h5>Keyboard Shortcuts</h5>
                <ul class="shortcuts">
                    <li><span class="label label-default">L</span>Like</li>
                    <li><span class="label label-default">A</span>Add to collection</li>
                    <li><span class="label label-default">esc</span>Close</li>
                </ul>
            </div>
        </div>
    </ul>
    `,
    styles: [
        'td {font-size: 12px; padding: 6px 5px;}',
        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.works-detail { padding: 20px 25px 20px 20px; }',
        '.works-detail > i { cursor: pointer; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        'hr { margin-top: 25px; margin-bottom: 25px; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(93, 93, 93); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        '.shortcuts { margin: 0; padding: 0; list-style: none; }',
        '.shortcuts > li { display: inline-block; margin-right: 10px; padding-bottom: 15px; font-size: 12px; }',
        '.label {display: inline; font-size: 75%; font-weight: bold; line-height: 1; color: rgb(255, 255, 255); text-align: center; white-space: nowrap; vertical-align: baseline; padding: 0.2em 0.6em 0.3em; border-radius: 0.25em; font-size: 13px; margin-right: 5px; }',
        '.label-default { background-color: transparent; color: rgb(116, 116, 116); border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; font-weight: normal; border-width: 1px; border-style: solid; border-color: rgb(116, 116, 116); }',
        '.tags > a { display: inline-block; line-height: inherit; position: relative; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: inherit; font-size: 12px; }',
        'i { vertical-align: middle; }',
        'comment-item { display: inline-flex; width: 100%; }',
        '.editable:hover i { display: block; }',
        '.side-nav { z-index: 3010; width: 360px; }',
        '.file-field .btn { padding: 0 12px; }',
        '.file-field > a { margin: 0 12px 0 0; }',
    ],
    animations: [
        trigger('panelState', [
            state('show', style({
                transform: 'translate(0px)'
            })),
            state('hide', style({
                transform: 'translate(-360px)'
            })),
            transition('show => hide', animate('100ms ease-in')),
            transition('hide => show', animate('100ms ease-out'))
        ])
    ]
})
export class WorksDetailComponent implements OnDestroy {
    private item: IItem;
    private title: string = '';
    private description: string = '';
    private comments: any[];
    private comment: string = '';
    private customThumbnail: File = null;
    private prompted: boolean;
    private user: User;
    private isOwner: boolean;
    private active: boolean;
    private editing: boolean = false;
    private visible: string = 'hide';
    private sub;

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private userservice: UserService,
        private tagssservice: TagsService,
        private commentservice: CommentService,
        private router: Router) {
        this.comments = [];
        this.prompted = false;
        this.active = true;

        userservice.results.subscribe(user => {
            this.user = user;
        });
        userservice.get();
        this.sub = service.detail.subscribe(data => {
            let item = data.item;
            let show = data.showComponent;
            if (item) {
                this.isOwner = item.author.id == this.user.id;
                this.commentservice.get(item).subscribe(comments => this.comments = comments);
                if (this.visible == 'show' && show && this.item == item) {
                    // -- Toggle off
                    this.visible = 'hide';
                }
                else {
                    this.visible = (show) ? 'show' : 'hide';
                }
                this.item = item;
            }
            else {
                this.visible = (show) ? 'show' : 'hide';
            }
        });
        
    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (this.item) {
            if (event.key === 'a') {
                // event.preventDefault();
            }
            if (event.key === 'l') {
                // event.preventDefault();
                this.like();
            }
        }
        
        if (event.key === 'Escape') {
            event.preventDefault();
            this.visible == 'hide';
        }
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
    like() {
        this.works.likeItem(this.item);
    }
    postComment() {
        this.commentservice.add(this.item, this.comment).subscribe(comment => {
            let comments = this.comments.slice(0);
            comments.push(comment);
            this.comments = comments;
        });
        this.comment = '';
        this.prompted = false;
    }
    removeTag(tag: Tag) {
        this.works.editTags([this.item], [], [tag]).subscribe();
    }
    addTag(event: any) {
        let found = false;
        for (let t of this.item.tags) {
            if (event.tag.id == t.id) {
                found = true;
                break;
            }
        }
        if (!found) {
            let name = event.tag.name;
            this.tagssservice.create(name).subscribe(tag => {
                this.works.editTags([this.item], [tag], []).subscribe(result => {;
                    let tags = this.item.tags.splice(0);
                    tags.push(tag);
                    this.item.tags = tags;
                });
            });
        }
    }
    edit() {
        if (this.editing) {
            let element = <HTMLInputElement>event.srcElement;
            if (this.customThumbnail) {
                this.works.upload(this.item, [this.customThumbnail]).subscribe(item => {
                    this.item.thumbnail = item.thumbnail;
                });
            }
            this.item.title = this.title;
            this.item.description = this.description;
            this.works.update(this.item).subscribe(item => this.active = true);
        }
        else {
            this.title = this.item.title;
            this.description = this.item.description;
        }
        this.editing = !this.editing;
    }
    revert() {
        this.title = '';
        this.description = '';
        this.customThumbnail = null;
        this.editing = false;
    }
    resetThumbnail() {
        this.works.upload(this.item, null, true).subscribe(item => {
            this.item.thumbnail = item.thumbnail;
            this.customThumbnail = null;
        });
    }
    navigateToTag(tag: Tag) {
        this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
    }
    toggle() {
        this.visible = (this.visible == 'hide') ? 'show': 'hide';
        if (this.visible == 'hide') {
            this.revert();
        }
    }
}