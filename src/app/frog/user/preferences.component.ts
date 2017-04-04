import { Component, trigger, state, style, transition, animate } from '@angular/core';

import { Subscription } from 'rxjs';

import { User, Gallery } from '../shared/models';
import { PreferencesService } from './preferences.service';
import { UserService } from './user.service';
import { GalleryService } from '../works/gallery.service';

@Component({
    selector: 'preferences',
    templateUrl: './html/preferences.html',
    styles: [
        '.side-nav { padding: 6px .25rem 0 .25rem; width: 360px; z-index: 3010; }',
        '.side-nav li { line-height: inherit; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'a { color: inherit; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); font-weight: inherit; }',
        'a.btn { line-height: 36px !important; height: 36px !important; padding: inherit; margin: 0 !important; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: 0 2rem; font-size: 12px; }',
        'i { vertical-align: middle; }',
        'ul > div:first-child { overflow: auto; }',
        'hr { margin: 8px 0; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(49, 49, 49); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        'ul > div > i { cursor: pointer; }',
        'input[type="range"] { border: none; }',
        'h5 { font-size: 1.5rem; }',

        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.swatch { width: 32px; height: 32px; margin: 4px; float: left; border: 2px solid #333; cursor: pointer; }',
        '.swatch.active { border-color: #8bc34a; }'
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
export class PreferencesComponent {
    private subs: Subscription[];
    private prefs: Object = {};
    private galleries: Gallery[];
    private user: User;
    private visible: string = 'hide';
    private swatches: Object;
    private keys: string[];

    constructor(private service: PreferencesService, private userservice: UserService, private galleryservice: GalleryService) {
        this.subs = [];
        this.swatches = {
            'black': '#000000',
            'grey': '#9e9e9e',
            'grey darken-4': '#212121',
            'white': '#ffffff'
        }
        this.keys = Object.keys(this.swatches);
        let sub = userservice.user.subscribe(user => {
            if (user) {
                this.user = user as User;
            }
        });
        this.subs.push(sub);
        sub = service.visible.subscribe(vis => (vis) ? this.show() : this.hide());
        this.subs.push(sub);
        sub = service.preferences.subscribe(prefs => {
            this.prefs = prefs;
            sub = galleryservice.items.subscribe(items => {
                let personal = 2;
                this.galleries = items.filter(gallery => gallery.security < personal);
            });
            this.subs.push(sub);
        });
        this.subs.push(sub);

    }
    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
}
