import { Component, Input, OnInit, OnDestroy, AfterContentInit, HostListener, trigger, state, style, transition, animate } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

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
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey-text text-lighten-1">
        <div *ngIf="item">
            <i (click)="toggle()" class="material-icons right">close</i>
            <i (click)="edit()" class="material-icons right" [class.light-green-text]="editing">{{(editing) ? "check_circle" : "edit"}}</i>
            <i *ngIf="editing" (click)="revert()" class="material-icons right red-text tooltipped" data-position="bottom" data-tooltip="Discard changed">delete_sweep</i>
            <!--<div *ngIf="editing && item.guid.charAt(0) === '2'">
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
            </div>-->
            
            <div class="row grey-text text-lighten-1">
                <div class="artwork-info ps-container col s12">
                    <div class="separator-sm"></div>
                    <div class="artist">
                        <div *ngIf="!editing" class="artist-name-and-headline">
                            <div class="name">
                                <a href="{{authorLink}}" class="light-green-text">{{item.author.name | capitalize:1}}</a>
                            </div>
                            <div class="headline">{{item.author.email}}</div>
                        </div>
                        <div *ngIf="editing">
                            <userinput (onSelect)="selectArtistHandler($event)" [user]="item.author"></userinput>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s4">
                    <a (click)="like()" class="waves-effect waves-light btn light-green"><i class="material-icons left">thumb_up</i> Like</a>
                </div>
            </div>
            <div class="row">
                <h3 *ngIf="!editing || !isOwner" class="white-text col s12 truncate" title="{{item.title}}">{{item.title}}</h3>
                <div *ngIf="editing && isOwner" class="col s12">
                    <div class="input-field">
                        <input id="title" type="text" [(ngModel)]="title" />
                        <label class="active" for="title">Title</label>
                    </div>
                </div>
                <div *ngIf="!editing || !isOwner" class="description col s12" id="project-description" style="max-height: none;">
                    <p>{{item.description}}</p>
                </div>
                <div *ngIf="editing && isOwner">
                    <div class="col s12">
                        <div class="input-field">
                            <textarea id="description" class="materialize-textarea1 expanded" [(ngModel)]="description" placeholder="Description"></textarea>
                        </div>
                    </div>
                </div>
                <small class="col s12"><i>{{item.created | date}}</i></small>
                <div class="separator-sm"></div>
                <div class="col s12">
                    <ul class="list-inline">
                        <li>
                            <i class="material-icons tiny">thumb_up</i> {{item.like_count}} Likes
                        </li>
                        <li>
                            <i class="material-icons tiny">comment</i> {{item.comment_count}} Comments
                        </li>
                    </ul>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col s12">
                    <h4 class="title">
                        <i class="material-icons light-green-text">label</i> Tags
                    </h4>
                    <tag *ngFor="let tag of item.tags | tagArtistFilter" [item]="tag.id" [dark]="true" (onClose)="removeTag($event)" (onClick)="navigateToTag(tag)"></tag>
                    <autocomplete (onSelect)="addTag($event)" [placeholder]="'Add Tags'" [icon]="'add'"></autocomplete>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col s12">
                    <h4 class="title">
                        <i class="material-icons light-green-text">info</i> Details
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
            </div>
            <hr />
            <div class="row">
                <div class="col s12">
                    <h4>
                        <i class="material-icons light-green-text">comment</i> {{item.comment_count}} Comments
                    </h4>
                    <ul>
                        <li *ngFor="let comment of comments"><comment-item [comment]="comment"></comment-item></li>
                    </ul>
                    <textarea [(ngModel)]=comment (focus)="true" (keydown)="$event.stopPropagation()" (focus)="prompted = true" placeholder="Add a comment..." [class.expanded]="prompted"></textarea>
                    <div *ngIf="prompted" class="col s6">
                        <a class="waves-effect waves-light light-green btn" (click)="postComment()"><i class="material-icons left">comment</i>Post Comment</a>
                    </div>
                </div>
            </div>
        </div>
    </ul>
    `,
    styles: [
        '.side-nav { padding: 6px .25rem 0 .25rem; width: 360px; z-index: 3010; }',
        '.side-nav li { line-height: inherit; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: inherit; }',
        'a.btn { line-height: 36px !important; height: 36px !important; padding: inherit; margin: 0 !important; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: 0 2rem; font-size: 12px; }',
        'i { vertical-align: middle; }',
        'ul > div:first-child { overflow: auto; }',
        'hr { margin: 8px 0; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(49, 49, 49); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        'ul > div > i { cursor: pointer; }',

        'td {font-size: 12px; padding: 6px 5px;}',
        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        '.description p { white-space: pre; }',
        'comment-item { display: inline-flex; width: 100%; }',
        '.editable:hover i { display: block; }',
        '.file-field .btn { padding: 0 12px; }',
        '.file-field > a { margin: 0 12px 0 0; }',
        'textarea { border: none; border-left: 4px solid #4caf50; outline: none; transition: height 500ms; background-color: #1b1b1b; }',
        'textarea.expanded { height: 100px; }',
        'textarea::-webkit-input-placeholder { color: #707070; }'
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
    private artist: User;
    private authorLink: string;
    private isOwner: boolean;
    private active: boolean;
    private editing: boolean = false;
    private visible: string = 'hide';
    private subs: Subscription[];

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private userservice: UserService,
        private tagssservice: TagsService,
        private commentservice: CommentService,
        private router: Router) {
        this.comments = [];
        this.subs = [];
        this.prompted = false;
        this.active = true;
        this.user = new User();
        this.artist = null;

        let sub = userservice.user.subscribe(user => {
            if (user.id == this.user.id) {
                return;
            }
            this.user = user as User;

            let sub = service.detail.subscribe(data => {
                let item = data.item;
                let show = data.showComponent;
                if (item) {
                    for(let i=0;i<item.tags.length;++i) {
                        if (item.tags[i].artist) {
                            this.authorLink = '/w/' + this.works.id + '/' + item.tags[i].id;
                            break;
                        }
                    }
                    this.isOwner = item.author.id == this.user.id || this.user.isManager;
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
            this.subs.push(sub);
        });
        this.subs.push(sub);
        userservice.get();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
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
        this.prompted = false;
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
        this.works.editTags([this.item], [], [tag]).subscribe(result => {;
            this.item.tags = result[0].tags;
        });
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
    selectArtistHandler(user: User) {
        this.artist = user;
    }
    edit() {
        if (this.editing) {
            if (this.isOwner) {
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
            if (this.artist) {
                this.works.setArtist([this.item], this.artist);
                this.isOwner = this.artist.id == this.user.id || this.user.isManager;
                this.artist = null;
            }
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
        if (this.visible == 'hide') {
            this.show();
        }
        else {
            this.revert();
            this.hide();
        }
    }
}