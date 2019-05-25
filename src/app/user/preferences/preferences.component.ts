import { Component, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Subscription } from 'rxjs';

import { User, Gallery, Preferences } from '../../shared/models';
import { PreferencesService } from '../preferences.service';
import { UserService } from '../user.service';
import { GalleryService } from '../../works/gallery.service';
import { ErrorService } from '../../errorhandling/error.service';


@Component({
    selector: 'preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.css'],
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
export class PreferencesComponent implements AfterViewInit {
    private subs: Subscription[];
    public galleries: Gallery[];
    public swatches: Object;
    public keys: string[];
    public user: User;
    public prefs: Preferences;
    public visible: string = 'hide';

    constructor(
        public service: PreferencesService,
        private userservice: UserService,
        private galleryservice: GalleryService,
        private errors: ErrorService
    ) {
        this.subs = [];
        this.swatches = {
            'black': '#000000',
            'grey': '#9e9e9e',
            'grey darken-4': '#212121',
            'white': '#ffffff'
        };
        this.keys = Object.keys(this.swatches);
        let sub = userservice.user.subscribe(user => {
            if (user) {
                this.user = user as User;
            }
        }, error => this.errors.handleError(error));
        this.subs.push(sub);
        sub = service.visible.subscribe(vis => (vis) ? this.show() : this.hide(), error => this.errors.handleError(error));
        this.subs.push(sub);
        this.prefs = new Preferences();
    }
    ngAfterViewInit() {
        let sub = this.service.preferences.subscribe(prefs => {
            this.prefs = prefs;
            let sub = this.galleryservice.items.subscribe(items => {
                let personal = 2;
                this.galleries = items.filter(gallery => gallery.security < personal);
            }, error => this.errors.handleError(error));
            this.subs.push(sub);
        }, error => this.errors.handleError(error));
        this.subs.push(sub);

    }
    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
}
