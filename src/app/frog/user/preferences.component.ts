import { Component, Input, OnInit, OnDestroy, AfterContentInit, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { Subscription } from 'rxjs';

import { User } from '../shared/models';
import { PreferencesService } from './preferences.service';
import { UserService } from './user.service';

@Component({
    selector: 'preferences',
    template: `
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey-text text-lighten-1">
        <div>
            <i (click)="service.hide()" class="material-icons right grey-text">close</i>
        </div>
        <div class="row grey-text text-lighten-1">
            <div class="artwork-info ps-container col s12">
                <div class="separator-sm"></div>
                <div class="artist">
                    <div class="artist-name-and-headline">
                        <div class="name">
                            <a class="light-green-text">{{user?.name | capitalize:1}} <i *ngIf="user?.isManager" class="material-icons left">security</i></a>
                        </div>
                        <div class="headline">{{user?.email}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
                <hr />
                <h4 class="title grey-text text-lighten-1">
                    <i class="material-icons light-green-text">settings</i> Preferences
                </h4>
            </div>
        </div>
        <li>
            <div class="row">
                <div class="col s12">
                    <h6 class="grey-text text-lighten-1">Always Show Info</h6>
                    <div class="switch">
                        <label>Off<input #semi type="checkbox" (change)="service.setValue('semiTransparent', semi.checked)" [(ngModel)]="prefs.semiTransparent"><span class="lever"></span>On</label>
                    </div>
                </div>
            </div>
        </li>
        <li>
            <div class="row">
                <div class="input-field col s12">
                    <h6 class="grey-text text-lighten-1">Viewer Background Color</h6>
                    <div *ngFor="let key of keys" class="swatch {{key}}" [class.active]="prefs.backgroundColor === swatches[key]" (click)="service.setValue('backgroundColor', swatches[key])"></div>
                </div>
            </div>
        <li>
            <div class="row">
                <div class="input-field col s12">
                    <h6 class="grey-text text-lighten-1">Thumbnail Padding</h6>
                    <p class="range-field">
                        <input type="range" id="test5" min="0" max="10" #thumbpad (change)="service.setValue('thumbnailPadding', thumbpad.value)" value="{{prefs.thumbnailPadding}}" />
                    </p>
                </div>
            </div>
        </li>
        <li>
            <div class="row">
                <div class="col s12">
                    <h6 class="grey-text text-lighten-1">Comment Notifications</h6>
                    <div class="switch">
                        <label>Off<input #comments type="checkbox" (change)="service.setValue('emailComments', comments.checked)" [(ngModel)]="prefs.emailComments"><span class="lever"></span>On</label>
                    </div>
                </div>
            </div>
        </li>
        <li>
            <div class="row">
                <div class="col s12">
                    <h6 class="grey-text text-lighten-1">Likes Notifications</h6>
                    <div class="switch">
                        <label>Off<input #likes type="checkbox" (change)="service.setValue('emailLikes', likes.checked)" [(ngModel)]="prefs.emailLikes"><span class="lever"></span>On</label>
                    </div>
                </div>
            </div>
        </li>
    </ul>`,
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
    private user: User;
    private visible: string = 'hide';
    private swatches: Object;
    private keys: string[];

    constructor(private service: PreferencesService, private userservice: UserService) {
        this.subs = [];
        this.swatches = {
            'black': '#000000',
            'grey': '#9e9e9e',
            'grey darken-4': '#212121',
            'white': '#ffffff'
        }
        this.keys = Object.keys(this.swatches);
        let sub = userservice.results.subscribe(user => {
            if (user) {
                this.user = user as User;
            }
        });
        this.subs.push(sub);
        sub = service.visible.subscribe(vis => (vis) ? this.show() : this.hide());
        this.subs.push(sub);
        sub = service.preferences.subscribe(prefs => this.prefs = prefs);
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