import { Component, AfterViewInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SelectionService } from '../../shared/selection.service';
import { Tag, Gallery, User, Notification, CItem, SiteConfig, CGroup } from '../../shared/models';
import { TagsService } from '../../tags/tags.service';
import { NavigationComponent } from '../../shared/navigation/navigation.component';
import { UserService } from '../../user/user.service';
import { UserInputComponent } from '../../user/user-input/user-input.component';
import { NotificationService } from '../../notifications/notification.service';
import { WorksService } from '../works.service';
import { ErrorService } from '../../errorhandling/error.service';
import { GalleryService } from '../gallery.service';
import { SiteConfigService } from '../../shared/siteconfig.service';
import { GroupService } from '../../groups/group.service';
import { RemoveDialogComponent } from '../../shared/remove-dialog/remove-dialog.component';


@Component({
    selector: 'selection-detail',
    templateUrl: './selection-detail.component.html',
    styleUrls: ['./selection-detail.component.css'],
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
export class SelectionDetailComponent implements AfterViewInit, OnDestroy {
    @ViewChild(NavigationComponent) copyNav: NavigationComponent;
    @ViewChild(NavigationComponent) moveNav: NavigationComponent;
    @ViewChild(UserInputComponent) userinput: UserInputComponent;
    @ViewChild(RemoveDialogComponent) dialog: RemoveDialogComponent;

    public items: CItem[];
    public tags: Tag[];
    public guids: string;
    private subs: Subscription[];
    public siteconfig: SiteConfig;
    public user: User;
    public enabled = false;
    public visible = 'hide';

    constructor(
        public service: SelectionService,
        public works: WorksService,
        private tagsservice: TagsService,
        private userservice: UserService,
        private notify: NotificationService,
        private errors: ErrorService,
        private galleryservice: GalleryService,
        private siteconfigservice: SiteConfigService,
        private groupservice: GroupService,
        private router: Router) {
        this.tags = [];
        this.items = [];
        this.subs = [];

        let sub = service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.guids = this.items.map(function (_) { return _.guid }).join(',');
            this.aggregateTags();
            if (this.items.length === 0) {
                this.visible = 'hide';
            }
        }, error => this.errors.handleError(error));
        this.subs.push(sub);

        sub = this.siteconfigservice.siteconfig.subscribe(siteconfig => this.siteconfig = siteconfig);
        this.subs.push(sub);

        sub = this.userservice.user.subscribe(user => this.user = user);
        this.subs.push(sub);
    }
    ngAfterViewInit() {
        this.userinput.query = '';
    }
    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.key === 'Tab' && this.items.length > 0) {
            event.preventDefault();
            this.visible = 'show';
        }
    }
    zIndex() {
        return (this.enabled) ? 950 : 0;
    }
    aggregateTags() {
        let tags = [];
        let ids = [];

        for (let item of this.items) {
            for (let tag of item.tags) {
                if (ids.indexOf(tag.id) === -1) {
                    tags.push(<Tag>tag);
                    ids.push(tag.id);
                }
            }
        }

        this.tags = tags;
    }
    removePrompt() {
        this.dialog.show(this.items);
    }
    addTag(event: any) {
        this.tagsservice.resolve(event.value).subscribe(tag => {
            let name = (tag) ? tag.name : event.value;
            this.tagsservice.create(name).subscribe(tag => {
                this.works.editTags(this.items, [tag], []).subscribe(() => {
                    let found = false;
                    let tags = this.tags.slice(0);

                    for (let t of tags) {
                        if (tag.id === t.id) {
                            found = true;
                            t.added = true;
                            break;
                        }
                    }
                    if (!found) {
                        tags.push(tag);
                    }

                    for (let item of this.items) {
                        item.addTag(tag);
                    }

                    this.tags = tags;
                }, error => this.errors.handleError(error));
            }, error => this.errors.handleError(error));
        }, error => this.errors.handleError(error));
    }
    removeTag(tag) {
        this.works.editTags(this.items, [], [tag]).subscribe(null, error => this.errors.handleError(error));
    }
    offset(index: number) {
        return index * 8 + 12;
    }
    navigateToTag(tag: Tag) {
        this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
    }
    toggle() {
        this.userinput.query = '';
        this.tags.map(tag => tag.added = false);
        this.visible = (this.visible === 'hide') ? 'show' : 'hide';
    }
    gallerySelectHandler(gallery: Gallery, move = false) {
        let guids = this.items.map(item => item.guid);
        if (move) {
            this.works.copyItems(guids, this.works.id, gallery.id);
        }
        else {
            this.works.copyItems(guids, null, gallery.id);
        }
    }
    selectArtistHandler(user: User) {
        this.works.setArtist(this.items, user);
        this.notify.add(new Notification('Artists changed', 'done'));
    }
    canGroup() {
        let groups = this.items.filter(i => i.guid.charAt(0) === '4');
        if (groups.length > 0) {
            return false;
        }
        return this.items.filter(i => i.guid.charAt(0) !== '4').length > 1;
    }
    canAddToGroup() {
        let groups = this.items.filter(i => i.guid.charAt(0) === '4');
        if (groups.length !== 1) {
            return false;
        }
        return this.items.filter(i => i.guid.charAt(0) !== '4').length > 0;
    }
    addToGroup() {
        let groups = this.items.filter(i => i.guid.charAt(0) === '4');
        let owned = this.items.filter(i => i.author.id === this.user.id && i.guid.charAt(0) !== '4');
        this.groupservice.append(groups[0] as CGroup, owned);
    }
    copyLink() {
        let guids = this.items.map(i => i.guid);
        let link = `${window.location.origin}/v/0/`;
        link += guids.join(',');

        let element = document.createElement('DIV');
        element.textContent = link;
        document.body.appendChild(element);
        this.selectElementText(element);
        document.execCommand('copy');
        element.remove();

        this.notify.add(new Notification('Link copied to clipboard', 'share'));
    }

    private selectElementText(element) {
        let range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}
