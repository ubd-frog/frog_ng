import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';

import { PreferencesService } from '../../user/preferences.service';
import { UserService } from '../../user/user.service';
import { SiteConfig, User } from '../../shared/models';
import { Subscription, Observable } from 'rxjs';
import { ManageTagsDialogComponent } from '../../tags/manage-tags-dialog/manage-tags-dialog.component';
import { ReleasenotesDialogComponent } from '../../releasenotes/releasenotes-dialog/releasenotes-dialog.component';
import { SiteconfigComponent, SiteConfigService } from '../../siteconfig';
import {BadgeDialogComponent} from "../../badge/badge-dialog/badge-dialog.component";


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
    @ViewChild(ManageTagsDialogComponent) tagslist: ManageTagsDialogComponent;
    @ViewChild(ReleasenotesDialogComponent) releasenotes: ReleasenotesDialogComponent;

    private subs: Subscription[] = [];
    public visible = 'hide';
    public user$: Observable<User>;
    public siteconfig: SiteConfig;

    constructor(
        public preferencesService: PreferencesService,
        private userservice: UserService,
        private siteconfigservice: SiteConfigService,
        private dialog: MatDialog,
        private element: ElementRef
    ) {

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
            if (clickedComponent === this.element.nativeElement.parentElement) {
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

    openSiteConfig() {
        this.dialog.open(SiteconfigComponent, { width: '500px' });
    }

    openBadgeDialog() {
        this.dialog.open(BadgeDialogComponent, { width: '800px' });
    }
}
