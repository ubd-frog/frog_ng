import { Component, Input, AfterViewInit, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import {IItem, CImage, CVideo, Preferences} from '../shared/models';
import { Point, Matrix } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';
import { WorksService } from '../works/works.service';
import { PreferencesService } from '../user/preferences.service';
import { ImageComponent } from './image.component';
import { VideoComponent } from './video.component';
import {StorageService} from "../shared/storage.service";
import {Observable} from "rxjs/Observable";

declare var $:any;


@Component({
    selector: 'viewer',
    templateUrl: './html/viewer.html',
    styles: [
        '#viewer { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }',
        '.actions { position: absolute; top: 16px; right: 16px; z-index: 3001; }',
        '.actions .btn-flat { font-size: 18px; font-family: Roboto; font-weight: 500; }',
        '.row { margin-bottom: 0; z-index: 3000; height: 100%; }',
        '.row > div.col { height: 100%; }',
        '.row a { height: 100%; opacity: 0; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.row a:hover { height: 100%; opacity: 1; }',
        'frog-image { position: fixed; }',
        'a { cursor: pointer; }',
        '.col.s1.right { position: absolute; right: 0; }',
        '.col.s1.left { position: absolute; }',
        '.close-button { position: absolute; top: 0; right: 0; }',
        '.close-button:hover { position: absolute; top: 0; right: 0; }',
        'works-detail ul { z-index: 3010; }',
        '.nav-arrow { position: absolute; width: 100px; height: 100%; z-index: 3000; opacity: 0; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.nav-arrow:hover { opacity: 1; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.nav-arrow a { height: 100%; position: fixed; }',
        '.original { text-align: center; font-family: Roboto; font-weight: 500; }',

        '.keyboard { position:absolute; z-index: 40; top: 64px; right: 16px; }',
        'kbd { display: inline-block;padding: 3px 5px;font: 11px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;line-height: 10px;color: #444d56;vertical-align: middle;background-color: #fcfcfc;border: solid 1px #c6cbd1;border-bottom-color: #959da5;border-radius: 3px;box-shadow: inset 0 -1px 0 #959da5;}'
    ]
})
export class ViewerComponent implements OnInit, OnDestroy {
    @ViewChild(ImageComponent) image: ImageComponent;
    @ViewChild(VideoComponent) video: VideoComponent;

    private allitems: IItem[];
    private viewall: boolean = false;
    private index: number = -1;
    private subs: Subscription[] = [];
    private closeroute: string;
    public objects: IItem[] = [];
    public itemtype: string;
    public prefs: Preferences;
    public width: number = 0;
    public height: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private selectionservice: SelectionService,
        private storageservice: StorageService,
        private location: Location,
        private prefservice: PreferencesService
    ) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        let sub = this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
        this.subs.push(sub);
    }
    ngOnInit() {
        let sub = this.route.params.subscribe(params => {
            let guid = params['guid'];

            // Read cache first
            let cache = this.storageservice.get('viewer');
            if (cache === null) {
                let guids = (params['selection'] || '').split(',');
                if (guids[0].length !== 16) {
                    // Gallery id, not selection
                    this.closeroute = '/w/' + guids[0];
                    guids = [''];
                }

                if (params['gallery']) {
                    this.closeroute = '/w/' + params['gallery'];
                }

                if (guids.length === 1 && guids[0] === '') {
                    this.viewall = true;
                    guids = [guid];
                }

                let obsall = this.service.results.take(1);
                let obsresolve = this.service.resolveGuids(guids);

                sub = Observable.forkJoin([obsall, obsresolve]).subscribe(results => {
                    if (this.viewall && results[0][0].length > 0) {
                        this.allitems = results[0][0];
                        this.objects = this.allitems;
                    }
                    else {
                        this.objects = results[1] as any;
                        let data = {
                            'closeroute': this.closeroute,
                            'assets': this.objects
                        };
                        this.storageservice.set('viewer', JSON.stringify(data));
                    }

                    this.index = Math.max(0, this.objects.map(o => o.guid).indexOf(guid));
                    this.setIndex(this.index);
                });
                this.subs.push(sub);
            }
            else {
                // populate from cache
                let data = JSON.parse(cache);
                this.closeroute = data['closeroute'];
                this.objects = data['assets'];
                this.index = Math.max(0, this.objects.map(o => o.guid).indexOf(guid));
                this.setIndex(this.index);
            }
        });
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
    @HostListener('window:resize')
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        let triggered = false;
        if (event.key === 'Tab' || event.keyCode === 0 || event.keyCode === 9) {
            triggered = true;
            this.setFocus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'Left' || event.key === 'a') {
            triggered = true;
            this.previous();
        }
        if (event.key === 'ArrowRight' || event.key === 'Right' || event.key === 'd') {
            triggered = true;
            this.next();
        }
        if (event.key === '2' || event.key === 'ArrowDown' || event.key === 's') {
            triggered = true;
            this.fitToWindow();
        }
        if (event.key === '1' || event.key === 'ArrowUp' || event.key === 'w') {
            triggered = true;
            this.original();
        }
        if (event.key === 'Escape' || event.key === 'Esc') {
            triggered = true;
            this.close(event);
        }

        if (triggered) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        this.clearCache();
    }
    @HostListener('window:onbeforeunload', ['$event'])
    onBeforeUnload(event) {
        this.clearCache();
    }
    next() {
        let index:number = this.index + 1;
        index = (index > this.objects.length - 1) ? 0 : index;
        this.setIndex(index);
    }
    previous() {
        let index = this.index - 1;
        index = (index < 0) ? this.objects.length - 1 : index;
        this.setIndex(index);
    }
    original() {
        if (this.image) {
            this.image.original();
        }
        if (this.video) {
            this.video.original();
        }
    }
    fitToWindow() {
        if (this.image) {
            this.image.fitToWindow();
        }
        if (this.video) {
            this.video.fitToWindow();
        }
    }
    download() {

    }
    setFocus() {
        this.selectionservice.setDetailItem(this.objects[this.index]);
    }
    close(event: Event) {
        event.preventDefault();
        this.selectionservice.clearDetailItem();

        // Clear the cache
        this.clearCache();
        // Use closeroute
        this.router.navigate([this.closeroute || this.service.routecache || '/w/1']);
    }
    setIndex(index:number) {
        if (this.objects[index].guid.charAt(0) === this.objects[this.index].guid.charAt(0)) {
            this.selectionservice.clearDetailItem();
        }
        this.index = index;
        if (this.objects.length) {
            switch(this.objects[index].guid.charAt(0)) {
                case '1':
                    this.itemtype = 'image';
                    break;
                case '2':
                    this.itemtype = 'video';
                    break;
            }

            this.selectionservice.setDetailItem(this.objects[index], false);
            let url = ['/v', this.objects[this.index].guid];
            if (this.objects.length > 1 && !this.viewall) {
                url.push(this.objects.map(o => o.guid).join(','));
            }
            this.router.navigate(url, {replaceUrl: true});
        }
    }
    clearCache() {
        this.storageservice.pop('viewer');
    }
}
