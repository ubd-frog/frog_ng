import { Component, Input, AfterViewInit, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';

import { IItem } from '../shared/models';
import { Point, Matrix } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';
import { WorksService } from '../works/works.service';
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
    <div id='viewer' class="noselect">
        <frog-image *ngIf="itemtype === 'image'"></frog-image>
        <frog-video *ngIf="itemtype === 'video'"></frog-video>
    </div>
    `,
    styles: [
        '#viewer { background: #000; position: absolute; width: 100%; height: 100%; top: 0; left: 0; }',
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
        '.original { text-align: center; font-family: Roboto Black; }'
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
    private sub;
    private datasub;
    private resultssub;
    width: number = 0;
    height: number = 0;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private selectionservice: SelectionService,
        private location: Location
    ) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
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
        this.resultssub = this.service.results.subscribe(items => {
            this.allitems = items;
        });
        this.datasub = this.route.data.subscribe(data => {
            if (data['all']) {
                this.viewall = true;
            }
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
        this.resultssub.unsubscribe();
        this.datasub.unsubscribe();
    }
    @HostListener('window:resize')
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.previous();
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.next();
        }
        if (event.key === '2') {
            event.preventDefault();
            this.fitToWindow();
        }
        if (event.key === '1') {
            event.preventDefault();
            this.original();
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            this.close(event);
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
        this.router.navigate([this.service.routecache || '/w/1']);
    }
    setIndex(index:number) {
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