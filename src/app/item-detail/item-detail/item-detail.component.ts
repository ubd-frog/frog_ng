import { Component, ViewChild, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CItem, Tag, User, Gallery, SiteConfig, CGroup } from '../../shared/models';
import { CommentService } from '../../comments/comment.service';
import { SelectionService } from '../../shared/selection.service';
import { RemoveDialogComponent } from '../../shared/remove-dialog/remove-dialog.component';
import { UserService } from '../../user/user.service';
import { WorksService } from '../../works/works.service';
import { CropperComponent } from '../../cropper/cropper/cropper.component';
import { TagsService } from '../../tags/tags.service';
import { GalleryService } from '../../works/gallery.service';
import { ErrorService } from '../../errorhandling/error.service';
import { SiteConfigService } from '../../shared/siteconfig.service';
import { NotificationService } from '../../notifications/notification.service';
import { GroupService } from '../../groups/group.service';


declare var $: any;


@Component({
    selector: 'works-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.css'],
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
export class ItemDetailComponent implements OnDestroy, AfterViewInit {
    @ViewChild(CropperComponent) cropper: CropperComponent;
    @ViewChild(RemoveDialogComponent) dialog: RemoveDialogComponent;

    private title = '';
    private description = '';
    private comments: any[];
    private comment = '';
    private prompted: boolean;
    private user: User;
    private artist: User;
    private authorLink: string;
    private isOwner: boolean;
    private active: boolean;
    private editing = false;
    private cachebust: number = new Date().getTime();
    private gallery: Gallery;
    private subs: Subscription[];
    public item: CItem;
    public visible = 'hide';
    public siteconfig: SiteConfig;

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private userservice: UserService,
        private tagsservice: TagsService,
        private commentservice: CommentService,
        private galleryservice: GalleryService,
        private siteconfigservice: SiteConfigService,
        private groupservice: GroupService,
        private notify: NotificationService,
        private errors: ErrorService,
        private router: Router) {
        this.comments = [];
        this.subs = [];
        this.prompted = false;
        this.active = true;
        this.user = new User();
        this.artist = null;

        let sub = userservice.user.subscribe(user => {
            if (user.id === this.user.id) {
                return;
            }
            this.user = user as User;

            let sub = service.detail.subscribe(data => {
                let item = data.item;
                let show = data.showComponent;
                if (item) {
                    for (let i = 0; i < item.tags.length; ++i) {
                        if (item.tags[i].artist) {
                            this.authorLink = '/w/' + this.works.id + '/' + item.tags[i].id;
                            break;
                        }
                    }
                    this.isOwner = item.author.id === this.user.id || this.user.isManager;
                    this.commentservice.get(item).subscribe(comments => this.comments = comments);
                    if (this.visible === 'show' && show && this.item === item) {
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
        sub = this.siteconfigservice.siteconfig.subscribe(v => this.siteconfig = v, error => this.errors.handleError(error));
        this.subs.push(sub);
        userservice.get();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {

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
        this.works.editTags([this.item], [], [tag])
            .subscribe(
                result => this.item.tags = result[0].tags,
                error => this.errors.handleError(error)
            );
    }
    addTag(event: any) {
        this.tagsservice.resolve(event.value).subscribe(tag => {
            if (tag) {
                let found = false;
                for (let t of this.item.tags) {
                    if (tag.id === t.id) {
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
                this.tagsservice.create(event.value).subscribe(t => {
                    this.works.editTags([this.item], [t], []).subscribe(() => {
                        let tags = this.item.tags.splice(0);
                        tags.push(t);
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
            if (this.artist) {
                this.works.setArtist([this.item], this.artist);
                this.isOwner = this.artist.id === this.user.id || this.user.isManager;
                this.artist = null;
            }
            this.item.title = this.title;
            this.item.description = this.description;
            this.works.update(this.item).subscribe(item => this.active = true, error => this.errors.handleError(error));
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
        if (this.visible === 'hide') {
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
        if (this.item.guid.charAt(0) === '4') {
            // Group
            this.groupservice.ungroup(this.item as CGroup);
        }
        else {
            this.dialog.show([this.item]);
        }
    }
}
