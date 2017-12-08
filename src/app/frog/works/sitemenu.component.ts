import {
    Component, OnInit, trigger, state, style, transition, animate, ElementRef, OnDestroy,
    ViewChild
} from '@angular/core';
import {PreferencesService} from "../user/preferences.service";
import {UserService} from "../user/user.service";
import {SiteConfig, User} from "../shared/models";
import {Subscription} from "rxjs";
import {TagsListComponent} from "../tags/tags-list.component";
import {GalleryService} from "./gallery.service";
import {ReleaseNotesComponent} from "../releasenotes/release-notes.component";
import {ReleaseNotesService} from "../releasenotes/release-notes.service";
import {SiteConfigService} from "../shared/siteconfig.service";

@Component({
    moduleId: module.id,
    selector: 'site-menu',
    templateUrl: './html/site-menu.html',
    styles: [
        'ul { position:absolute; right: 0; min-width: 250px; border: 1px solid #333; }',
        'li.active { background-color: #2b2b2b; }',
        'li:hover, .divider { background-color: #333; }',
        '.dropdown-content { overflow: hidden; opacity: 1; }'
    ],
    host: {
        '(document:click)': 'handleClick($event)'
    },
    animations: [
        trigger('panelState', [
            state('show', style({
                'max-height': 1000
            })),
            state('hide', style({
                'max-height': 0
            })),
            transition('show => hide', animate('100ms ease-in')),
            transition('hide => show', animate('1200ms ease-out'))
        ])
    ]
})
export class SiteMenuComponent implements OnInit, OnDestroy {
    @ViewChild(TagsListComponent) tagslist: TagsListComponent;
    @ViewChild(ReleaseNotesComponent) releasenotes: ReleaseNotesComponent;

    private elementRef: ElementRef;
    private subs: Subscription[] = [];
    public visible = 'hide';
    public user: User;
    public siteconfig: SiteConfig;

    constructor(
        public preferencesService: PreferencesService,
        private userservice: UserService,
        private galleryservice: GalleryService,
        private siteconfigservice: SiteConfigService,
        private element: ElementRef
    ) {
        this.elementRef = element;
        let sub = this.userservice.user.subscribe(user => this.user = user);
        this.subs.push(sub);
        sub = this.siteconfigservice.siteconfig.subscribe(data => {
            this.siteconfig = data;
        });
        this.subs.push(sub);
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }
    toggle() {
        this.visible = (this.visible === 'show') ? 'hide' : 'show';
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
    handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement.parentElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        }
        while (clickedComponent) {
            if (!inside) {
                this.hide();
            }
        }
    }
}
