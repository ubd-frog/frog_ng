import { Component, Input, AfterViewInit, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { IItem, CImage, CVideo } from '../shared/models';
import { Point, Matrix } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';
import { WorksService } from '../works/works.service';
import { PreferencesService } from '../user/preferences.service';
import { ImageComponent } from './image.component';
import { VideoComponent } from './video.component';

declare var $:any;


@Component({
    selector: 'viewer',
    template: `
    <works-detail></works-detail>
    
    <div *ngIf="objects.length > 1" class='col s1 left nav-arrow noselect'>
        <a (click)="previous()"><i class="material-icons large" [style.margin-top.px]="height / 2">navigate_before</i></a>
    </div>
    <div *ngIf="objects.length > 1" class='col s1 right nav-arrow noselect'>
        <a (click)="next()"><i class="material-icons large" [style.margin-top.px]="height / 2">navigate_next</i></a>
    </div>
    
    <div *ngIf="objects.length > 0" class='actions noselect'>
        <a (click)="close($event)" class="btn-floating right red darken-4"><i class="material-icons white-text">close</i></a>
        <a (click)="original()" class="waves-effect waves-light btn-floating right grey darken-4 original" title="Zoom to the original size">1:1</a>
        <a (click)="fitToWindow()" class="waves-effect waves-light btn-floating right grey darken-4" title="Zoom to fit the current window"><i class="material-icons">settings_overscan</i></a>
        <a (click)="setFocus()" class="waves-effect waves-light btn-floating right grey darken-4" title="Show information panel"><i class="material-icons">info_outline</i></a>
        <a *ngIf="objects.length > 1" class="btn-flat disabled right">{{index + 1}}/{{objects.length}}</a>
        
    </div>
    <div class="keyboard">
        <div style="padding-left: 14px;"><kbd>w</kbd></div>
        <kbd>a</kbd>
        <kbd>s</kbd>
        <kbd>d</kbd>
        <kbd>TAB</kbd>
    </div>
    <div id='viewer' class="noselect" [style.background]="prefs.backgroundColor">
        <frog-image *ngIf="itemtype === 'image'"></frog-image>
        <frog-video *ngIf="itemtype === 'video'"></frog-video>
    </div>
    `,
    styles: [
        '#viewer { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }',
        '.actions { position: absolute; top: 16px; right: 16px; z-index: 3000; }',
        '.actions .btn-flat { font-size: 18px; font-family: Roboto Black; }',
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
        'works-detail ul { z-index; 3010; }',
        '.nav-arrow { position: absolute; width: 100px; height: 100%; z-index: 3000; opacity: 0; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.nav-arrow:hover { opacity: 1; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
        '.nav-arrow a { height: 100%; position: fixed; }',
        '.original { text-align: center; font-family: Roboto Black; }',

        '.keyboard { position:absolute; z-index: 40; top: 64px; right: 16px; }',
        'kbd { display: inline-block;padding: 3px 5px;font: 11px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;line-height: 10px;color: #444d56;vertical-align: middle;background-color: #fcfcfc;border: solid 1px #c6cbd1;border-bottom-color: #959da5;border-radius: 3px;box-shadow: inset 0 -1px 0 #959da5;}'
    ]
})
export class ViewerComponent implements OnInit, OnDestroy {
    @ViewChild(ImageComponent) image: ImageComponent;
    @ViewChild(VideoComponent) video: VideoComponent;

    private objects: IItem[] = [];
    private allitems: IItem[];
    private viewall: boolean = false;
    private index: number = -1;
    private itemtype: string;
    private prefs: Object = {};
    private subs: Subscription[] = [];
    width: number = 0;
    height: number = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private selectionservice: SelectionService,
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
            this.index = +params['focus'];
            let guids = params['guids'].split(',');
            this.service.resolveGuids(guids).subscribe(items => {
                if (this.viewall && this.allitems.length > 0) {
                    this.objects = this.allitems;
                    for (let i = 0; i < this.allitems.length; i++) {
                        if (this.allitems[i].guid == items[this.index].guid) {
                            this.index = i;
                            break;
                        }
                    }
                }
                else {
                    this.objects = items;
                }
                this.setIndex(this.index);
            });
        });
        this.subs.push(sub);
        sub = this.service.results.subscribe(items => {
            this.allitems = items;
        });
        this.subs.push(sub);
        sub = this.route.data.subscribe(data => {
            if (data['all']) {
                this.viewall = true;
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
        if (event.key === 'ArrowLeft' || event.key === 'Left' || event.key === 'a') {
            triggered = true;
            this.previous();
        }
        if (event.key === 'ArrowRight' || event.key === 'Right' || event.key === 'd') {
            triggered = true;
            this.next();
        }
        if (event.key === '2' || event.key === 's') {
            triggered = true;
            this.fitToWindow();
        }
        if (event.key === '1' || event.key === 'w') {
            triggered = true;
            this.original();
        }
        if (event.key === 'Escape' || event.key === 'Esc') {
            triggered = true;
            this.close(event);
        }
        if (event.key === 'Tab' || event.keyCode === 0 || event.keyCode === 9) {
            triggered = true;
            this.setFocus();
        }

        if (triggered) {
            event.stopPropagation();
            event.preventDefault();
        }
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
        this.router.navigate([this.service.routecache || '/w/1']);
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
        }
    }
}
