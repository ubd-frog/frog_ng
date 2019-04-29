import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription, Observable } from 'rxjs';
import { User, SiteConfig } from '../../shared/models';
import { PreferencesService } from '../../user/preferences.service';
import { UserService } from '../../user/user.service';
import { GalleryService } from '../gallery.service';
import { SiteConfigService } from '../../shared/siteconfig.service';



@Component({
    moduleId: module.id,
    selector: 'site-menu',
    templateUrl: './sitemenu.component.html',
    styleUrls: ['./sitemenu.component.css'],
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
