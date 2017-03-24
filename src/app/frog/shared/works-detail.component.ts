import {
    Component, Input, ViewChild, OnInit, OnDestroy, AfterContentInit, HostListener, trigger, state, style,
    transition, animate, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '../user/user.service';
import { WorksService } from '../works/works.service';
import { CropperComponent } from '../works/cropper.component';
import {IItem, Tag, User, Gallery} from '../shared/models';
import { CapitalizePipe } from '../shared/capitalize.pipe';
import { TagArtistFilterPipe } from '../shared/tag-artist-filter.pipe';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { TagComponent } from '../tags/tag.component';
import { CommentComponent } from '../shared/comment.component';
import { CommentService } from '../shared/comment.service';
import { TagsService } from '../tags/tags.service';
import { SelectionService } from '../shared/selection.service';
import {GalleryService} from "../works/gallery.service";

declare var $:any;

@Component({
    selector: 'works-detail',
    template: `
    <div [@panelState]="visible" *ngIf="item" id="edit_actions" class="row grey darken-4 grey-text text-lighten-1">
        <i (click)="toggle()" class="material-icons right">close</i>
        <i (click)="edit()" class="material-icons right" [class.light-green-text]="editing">{{(editing) ? "check_circle" : "edit"}}</i>
        <i *ngIf="editing" (click)="revert()" class="material-icons right red-text tooltipped" data-position="bottom" data-tooltip="Discard changed">delete_sweep</i>
    </div>
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey-text text-lighten-1">
        <div *ngIf="item">
            <div *ngIf="editing" class="row" style="padding-top: 20px;">
                <div class="col s12">
                    <h4 class="title">
                        <i class="material-icons light-green-text">image</i> Thumbnail
                    </h4>
                    <li class="center-align">
                        <img src="{{item.thumbnail}}?foo={{cachebust}}" />
                    </li>

                    <div class="row">
                        <div class="col s6">
                            <div class="waves-effect waves-light btn light-green file-field">
                                <i class="material-icons">cloud_upload</i> Upload
                                <input type="file" (change)="upload($event)" />
                            </div>
                        </div>
                        <div class="col s6">
                            <a (click)="cropThumbnail()" class="waves-effect waves-light btn light-green"><i class="material-icons">crop</i> Crop</a>
                        </div>
                    </div>
                    <div *ngIf="item.custom_thumbnail" class="row">
                        <div class="col s6">
                            <a (click)="resetThumbnail()" class="waves-effect waves-light btn red darken-4"><i class="material-icons">close</i> Reset</a>
                        </div>
                    </div>
                </div>
            </div>
            <hr *ngIf="editing" />
            
            <div class="row grey-text text-lighten-1">
                <div class="artwork-info col s12">
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
                    <p [innerHTML]="item?.description | commentUrl | emojione"></p>
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
            <div class="row">
                <div class="col s6">
                    <a href="/frog/download?guids={{item.guid}}" class="waves-effect waves-light btn light-green"><i class="material-icons left">cloud_download</i> Download</a>
                </div>
                <div *ngIf="gallery" class="col s6">
                    <a (click)="copyNav.toggle()" class="waves-effect waves-light btn blue lighten-2"><i class="material-icons left">content_copy</i> Copy To</a>
                    <works-nav #copyNav (onSelect)="gallerySelectHandler($event)"></works-nav>
                </div>
            </div>
            <div *ngIf="gallery" class="row">
                <div class="col s6">
                    <a (click)="removePrompt()" class="waves-effect waves-light btn red darken-4"><i class="material-icons left">delete</i> Remove</a>
                </div>
                <div class="col s6">
                    <a (click)="moveNav.toggle()" class="waves-effect waves-light btn blue"><i class="material-icons left">exit_to_app</i> Move To</a>
                    <works-nav #moveNav (onSelect)="gallerySelectHandler($event, true)"></works-nav>
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
            <div class="row" style="margin-bottom: 64px;">
                <div class="col s12">
                    <h4>
                        <i class="material-icons light-green-text">comment</i> {{item.comment_count}} Comments
                    </h4>
                    <ul>
                        <li *ngFor="let comment of comments"><comment-item [comment]="comment"></comment-item></li>
                    </ul>
                    <div *ngIf="isOwner && prompted" class="light-blue-text text-lighten-2">
                        <i class="material-icons">info</i>
                        <span>You can <b (click)="edit()">edit</b> the item and add a description instead of leaving a comment</span>
                    </div>
                    <textarea [(ngModel)]=comment (focus)="true" (keydown)="$event.stopPropagation()" (focus)="prompted = true" placeholder="Add a comment..." [class.expanded]="prompted"></textarea>
                    <div *ngIf="prompted" class="col s6">
                        <a class="waves-effect waves-light light-green btn" (click)="postComment()"><i class="material-icons left">comment</i>Post Comment</a>
                    </div>
                </div>
            </div>
        </div>
    </ul>
    
    <div id="remove_prompt_single" class="modal">
        <div class="modal-content">
            <h4>Remove Item From Gallery?</h4>
            <p>Are you sure you wish to remove this item from the current gallery?</p>
            <small>This does not delete anything, it simply removes the item</small>
        </div>
        <div class="modal-footer">
            <a (click)="removeItems()" class=" modal-action modal-close waves-effect waves-green btn-flat">Ok</a>
            <a (click)="cancelPrompt()" class=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
        </div>
    </div>
    
    <cropper [item]="item" (onCrop)="reloadThumbnail($event)"></cropper>`,
    styles: [
        '.side-nav { padding: 16px .25rem 0 .25rem; width: 360px; z-index: 3010; }',
        '.side-nav li { line-height: inherit; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: inherit; }',
        'a.btn { line-height: 36px !important; height: 36px !important; padding: inherit; margin: 0 !important; }',
        '.btn { font-size: 12px; }',
        'i { vertical-align: middle; }',
        'ul > div:first-child { overflow: auto; }',
        'hr { margin: 8px 0; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(49, 49, 49); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        'ul > div > i, #edit_actions i { cursor: pointer; }',
        '.center-align img { width: 80%; }',
        '.btn.file-field { width: 100%; padding: 0 12px; }',

        'td {font-size: 12px; padding: 6px 5px;}',
        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        '.description p { white-space: pre-wrap; }',
        'comment-item { display: inline-flex; width: 100%; }',
        '.editable:hover i { display: block; }',
        '.file-field .btn { padding: 0 12px; }',
        '.file-field > a { margin: 0 12px 0 0; }',
        'textarea { border: none; border-left: 4px solid #4caf50; outline: none; transition: height 500ms; background-color: #1b1b1b; }',
        'textarea.expanded { height: 100px; }',
        'textarea::-webkit-input-placeholder { color: #707070; }',
        '#remove_prompt_single { z-index: 4000 !important; }',
        '#edit_actions { position: fixed; top: 0; width: 340px; z-index: 4000; padding-top: 6px; }',
        'b { cursor: pointer; text-decoration: underline; }'
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
export class WorksDetailComponent implements OnDestroy, AfterViewInit {
    @ViewChild(CropperComponent) cropper: CropperComponent;

    private item: IItem;
    private title: string = '';
    private description: string = '';
    private comments: any[];
    private comment: string = '';
    private prompted: boolean;
    private user: User;
    private artist: User;
    private authorLink: string;
    private isOwner: boolean;
    private active: boolean;
    private editing: boolean = false;
    private visible: string = 'hide';
    private cachebust: number = new Date().getTime();
    private gallery: Gallery;
    private subs: Subscription[];

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private userservice: UserService,
        private tagssservice: TagsService,
        private commentservice: CommentService,
        private galleryservice: GalleryService,
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
        sub = this.galleryservice.gallery.subscribe(gallery => this.gallery = gallery);
        this.subs.push(sub);
        userservice.get();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {
        $('#remove_prompt_single').modal();
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.revert();
            this.visible = 'hide';
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
                this.works.editTags([this.item], [tag], []).subscribe(() => {
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
        this.editing = false;
    }
    resetThumbnail() {
        this.works.upload(this.item, null, true).subscribe(item => {
            this.item = item;
            this.works.addItems([item]);
        });
    }
    cropThumbnail() {
        this.cropper.show();
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
    reloadThumbnail(item: IItem) {
        this.cachebust = new Date().getTime();
        this.item = item;
    }
    upload() {
        let element = <HTMLInputElement>event.srcElement;
        if (element.files.length) {
            this.works.upload(this.item, [element.files[0]]).subscribe(item => {
                this.item = item;
                this.works.addItems([item]);
            });
        }
    }
    gallerySelectHandler(gallery: Gallery, move: boolean = false) {
        if (move) {
            this.works.copyItems([this.item.guid], this.works.id, gallery.id);
        }
        else {
            this.works.copyItems([this.item.guid], null, gallery.id);
        }
    }
    removePrompt() {
        $('#remove_prompt_single').modal('open');
    }
    cancelPrompt() {
        $('#remove_prompt_single').modal('close');
    }
    removeItems() {
        this.works.remove([this.item]);
        this.service.clear();
        this.cancelPrompt();
        this.hide();
    }
}
