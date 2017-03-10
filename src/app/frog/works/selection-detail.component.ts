import { Component, OnInit, AfterViewInit, ViewChild, HostListener, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';

import { SelectionService } from '../shared/selection.service';
import { IItem, Tag, Gallery, User, Notification } from '../shared/models';
import { TagComponent } from '../tags/tag.component';
import { TagsService } from '../tags/tags.service';
import { TagArtistFilterPipe } from '../shared/tag-artist-filter.pipe';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { NavigationComponent } from './navigation.component';
import { UserService } from '../user/user.service';
import { UserInputComponent } from '../user/userinput.component';
import { NotificationService } from '../notifications/notification.service';

import { WorksService } from './works.service';

declare var $:any;

@Component({
    selector: 'selection-detail',
    template: `
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey-text text-lighten-1">
        <div>
            <i (click)="toggle()" class="material-icons right">close</i>
        </div>
        <li class="stack">
            <img *ngFor="let item of items | slice:0:10; let i = index" [style.left.px]="offset(i)" [style.top.px]="offset(i)" class="z-depth-1" src="{{item.thumbnail}}">
        </li>
        <hr />
        <div class="row">
            <div class="col s12">
                <h4 class="title">
                    <i class="material-icons light-green-text">filter</i> {{items.length}} Selected Items
                </h4>
            </div>
        </div>
        <div class="row">
            <div class="col s6">
                <a href="/frog/download?guids={{guids}}" class="waves-effect waves-light btn light-green"><i class="material-icons left">cloud_download</i> Download</a>
            </div>
            <div class="col s6">
                <a (click)="copyNav.toggle()" class="waves-effect waves-light btn blue lighten-2"><i class="material-icons left">content_copy</i> Copy To</a>
                <works-nav #copyNav (onSelect)="gallerySelectHandler($event)"></works-nav>
            </div>
        </div>
        <div class="row">
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
                <tag *ngFor="let tag of (tags | tagArtistFilter)" [item]="tag.id" [dark]="!tag.added" (onClose)="removeTag($event)" (onClick)="navigateToTag(tag)"></tag>
                <autocomplete (onSelect)="addTag($event)" [placeholder]="'Add Tags'" [icon]="'add'"></autocomplete>
            </div>
        </div>
        <hr />
        <div class="row">
            <div class="col s12">
                <h4 class="title">
                    <i class="material-icons light-green-text">person</i> Set Artist
                </h4>
                <userinput (onSelect)="selectArtistHandler($event)"></userinput>
            </div>
        </div>
    </ul>
    <div id="selection_bar" [hidden]="!enabled">
        <nav>
            <div class="nav-wrapper blue">
                <a class="brand-logo"><i class="material-icons" (click)="service.clear()">close</i> {{items.length}} selected</a>
                <ul class="right hide-on-med-and-down">
                    <li><a (click)="visible='show'"><i class="material-icons">info_outline</i></a></li>
                    <li><a href="/frog/download?guids={{guids}}"><i class="material-icons">cloud_download</i></a></li>
                    <li><a (click)="removePrompt()"><i class="material-icons">delete</i></a></li>
                </ul>
            </div>
        </nav>
    </div>
    <div id="remove_prompt" class="modal">
        <div class="modal-content">
            <h4>Remove Items From Gallery?</h4>
            <p>Are you sure you wish to remove ({{items.length || 0}}) from the current gallery?</p>
            <small>This does not delete anything, it simply removes the items</small>
        </div>
        <div class="modal-footer">
            <a (click)="removeItems()" class=" modal-action modal-close waves-effect waves-green btn-flat">Ok</a>
            <a (click)="cancelPrompt()" class=" modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
        </div>
    </div>
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
        '.brand-logo { font-size: 20px; font-weight: 500; }',

        '.fixed-action-btn { top: 82px; right: 24px; height: 55px; }',
        '#remove_prompt { z-index: 4000 !important; }',
        '.stack { position: relative; height: 256px; }',
        '.stack img { position: absolute; width: 128px; border: 1px solid #ccc; border-bottom-width: 20px; }',
        '.side-nav { overflow-y: inherit; }',
        '#selection_bar { position:fixed; width: 100%; z-index: 3000; }',
        '#selection_bar a { cursor: pointer; }'
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
export class SelectionDetailComponent implements AfterViewInit {
    @ViewChild(NavigationComponent) copyNav: NavigationComponent;
    @ViewChild(NavigationComponent) moveNav: NavigationComponent;
    @ViewChild(UserInputComponent) userinput: UserInputComponent;

    private items: IItem[];
    private tags: Tag[];
    private guids: string;
    private artist: User;
    public enabled: boolean = false;
    public visible: string = 'hide';

    constructor(
        private service: SelectionService,
        private works: WorksService,
        private tagssservice: TagsService,
        private userservice: UserService,
        private notify: NotificationService,
        private router: Router) {
        this.tags = [];
        this.items = [];
        service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.guids = this.items.map(function(_) {return _.guid}).join(',');
            this.aggregateTags();
            if (this.items.length == 0) {
                this.visible = 'hide';
            }
        });
    }
    ngAfterViewInit() {
        this.userinput.query = '';
        $('#remove_prompt').modal();
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.key == 'Tab' && this.items.length > 0) {
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
                if (ids.indexOf(tag.id) == -1) {
                    tags.push(<Tag>tag);
                    ids.push(tag.id);
                }
            }
        }

        this.tags = tags;
    }
    removePrompt() {
        $('#remove_prompt').modal('open');
    }
    cancelPrompt() {
        $('#remove_prompt').modal('close');
    }
    removeItems() {
        this.works.remove(this.items);
        this.service.clear();
        this.cancelPrompt();
    }
    addTag(event: any) {
        this.tagssservice.create(event.tag.name).subscribe(tag => {
            this.works.editTags(this.items, [tag], []).subscribe(() => {
                let found = false;
                let tags = this.tags.slice(0);

                for (let t of tags) {
                    if (tag.id == t.id) {
                        found = true;
                        t.added = true;
                        break;
                    }
                }
                if (!found) {
                    tags.push(tag);
                }

                this.tags = tags;
            });
        });
    }
    removeTag(tag) {
        this.works.editTags(this.items, [], [tag]).subscribe();
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
        this.visible = (this.visible == 'hide') ? 'show': 'hide';
    }
    gallerySelectHandler(gallery: Gallery, move: boolean = false) {
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
}
