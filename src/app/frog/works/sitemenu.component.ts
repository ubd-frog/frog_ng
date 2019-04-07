import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { PreferencesService } from '../user/preferences.service';
import { UserService } from '../user/user.service';
import { SiteConfig, User, Preferences } from '../shared/models';
import { Subscription, Observable } from 'rxjs';
import { GalleryService } from './gallery.service';
import { SiteConfigService } from '../shared/siteconfig.service';


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
    private elementRef: ElementRef;
    private subs: Subscription[] = [];
    public visible = 'hide';
    public user$: Observable<User>;
    public siteconfig: SiteConfig;

    constructor(
        public preferencesService: PreferencesService,
        private userservice: UserService,
        private galleryservice: GalleryService,
        private siteconfigservice: SiteConfigService,
        private element: ElementRef
    ) {
        this.elementRef = element;
    }

    ngOnInit() {
        this.user$ = this.userservice.user;
        let sub = this.siteconfigservice.siteconfig.subscribe(data => {
            this.siteconfig = data;
        });
        this.subs.push(sub);
    }
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
    slideShowDialog() {

    }
}
