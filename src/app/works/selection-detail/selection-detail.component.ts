import { Component, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { UserInputComponent } from '../../user/userinput/userinput.component';
import { RemoveDialogComponent } from '../../shared/remove-dialog/remove-dialog.component';
import { CItem, Tag, User, Gallery } from '../../shared/models';
import { SelectionService } from '../../shared/selection.service';
import { WorksService } from '../works.service';
import { TagsService } from '../../tags/tags.service';
import { UserService } from '../../user/user.service';
import { ErrorService } from '../../errorhandling/error.service';



declare var $: any;


@Component({
    selector: 'selection-detail',
    templateUrl: './selection-detail.component.html',
    styles: [
        '.side-nav { padding: 6px .25rem 0 .25rem; width: 360px; z-index: 3010; }',
        '.side-nav li { line-height: inherit; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: inherit; }',
        'a.btn { line-height: 30px !important; height: 30px !important; padding: 0 20px; margin: 0 !important; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: 0 2rem; font-size: 12px; }',
        '.btn i { font-size: 1rem; }',
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
        '.side-nav { overflow-y: auto; }',
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
    @ViewChild(RemoveDialogComponent) dialog: RemoveDialogComponent;

    public items: CItem[];
    public tags: Tag[];
    public guids: string;
    private artist: User;
    public enabled: boolean = false;
    public visible: string = 'hide';

    constructor(
        public service: SelectionService,
        private works: WorksService,
        private tagsservice: TagsService,
        private userservice: UserService,
        // private notify: NotificationService,
        private errors: ErrorService,
        private router: Router) {
        this.tags = [];
        this.items = [];
        service.selection.subscribe(items => {
            this.items = items;
            this.enabled = items.length > 0;
            this.guids = this.items.map(function (_) { return _.guid }).join(',');
            this.aggregateTags();
            if (this.items.length == 0) {
                this.visible = 'hide';
            }
        }, error => this.errors.handleError(error));
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
                        if (tag.id == t.id) {
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
        this.visible = (this.visible == 'hide') ? 'show' : 'hide';
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
        // this.notify.add(new Notification('Artists changed', 'done'));
    }
}
