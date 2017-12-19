import { Component, ViewChild, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '../user/user.service';
import { WorksService } from '../works/works.service';
import { CropperComponent } from '../works/cropper.component';
import { CItem, Tag, User, Gallery } from '../shared/models';
import { CommentService } from '../shared/comment.service';
import { TagsService } from '../tags/tags.service';
import { SelectionService } from '../shared/selection.service';
import { GalleryService } from "../works/gallery.service";
import { ErrorService } from "../errorhandling/error.service";

declare var $:any;

@Component({
    selector: 'works-detail',
    templateUrl: './html/works-detail.html',
    styles: [
        '.side-nav { padding: 16px .25rem 0 .25rem; width: 360px; z-index: 3010; }',
        '.side-nav li { line-height: inherit; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: inherit; }',
        'a.btn { line-height: 30px !important; height: 30px !important; padding: 0 20px; margin: 0 !important; }',
        '.btn { font-size: 12px; }',
        '.btn i { font-size: 1rem; }',
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
    private cachebust: number = new Date().getTime();
    private gallery: Gallery;
    private subs: Subscription[];
    public item: CItem;
    public visible: string = 'hide';

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private userservice: UserService,
        private tagsservice: TagsService,
        private commentservice: CommentService,
        private galleryservice: GalleryService,
        private errors: ErrorService,
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
            }, error => this.errors.handleError(error));
            this.subs.push(sub);
        }, error => this.errors.handleError(error));
        this.subs.push(sub);
        sub = this.galleryservice.gallery.subscribe(gallery => this.gallery = gallery, error => this.errors.handleError(error));
        this.subs.push(sub);
        userservice.get();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {
        $('#remove_prompt_single').modal();
    }
    @HostListener('window:keypress', ['$event'])
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
        }, error => this.errors.handleError(error));
        this.comment = '';
        this.prompted = false;
    }
    removeTag(tag: Tag) {
        this.works.editTags([this.item], [], [tag]).subscribe(result => {;
            this.item.tags = result[0].tags;
        }, error => this.errors.handleError(error));
    }
    addTag(event: any) {
        this.tagsservice.resolve(event.value).subscribe(tag => {
            if (tag) {
                let found = false;
                for (let t of this.item.tags) {
                    if (tag.id == t.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.works.editTags([this.item], [tag], []).subscribe(() => {
                        let tags = this.item.tags.splice(0);
                        tags.push(tag);
                        this.item.tags = tags;
                    }, error => this.errors.handleError(error));
                }
            }
            else {
                this.tagsservice.create(event.value).subscribe(tag => {
                    this.works.editTags([this.item], [tag], []).subscribe(() => {
                        let tags = this.item.tags.splice(0);
                        tags.push(tag);
                        this.item.tags = tags;
                    }, error => this.errors.handleError(error));
                });
            }
        }, error => this.errors.handleError(error));
    }
    selectArtistHandler(user: User) {
        this.artist = user;
    }
    edit() {
        if (this.editing) {
            if (this.isOwner) {
                this.item.title = this.title;
                this.item.description = this.description;
                this.works.update(this.item).subscribe(item => this.active = true, error => this.errors.handleError(error));
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
        }, error => this.errors.handleError(error));
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
    reloadThumbnail(item: CItem) {
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
