import { Component, Input, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { IItem, CVideo, Tag, User, Comment } from '../shared/models';
import { Point, Matrix, Rect } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';


@Component({
    selector: 'frog-video',
    template: `
    <div id='video_player' [style.margin-top.px]="margin" [style.width.px]="xform.elements[0][0]">
        <video #vid poster="{{object.poster}}" controls="controls" autoplay="autoplay" loop="loop" (mouseup)="up($event)" (mousedown)="down($event)" (mousemove)="move($event)">
            <source type='video/mp4' src="{{object.video}}" />
        </video>
        <div class='info row'>
            <span class='white-text text-darken-2 col s2 left-align'>{{frame}}/{{frameCount}}</span>
            <span class='white-text text-darken-2 col s8 center-align'>{{object.title}}</span>
            <span class='white-text text-darken-2 col s2 right-align'>{{object.framerate}} fps</span>
        </div>
    </div>`,
    styles: [
        'video { width: 100%; height: 100%; cursor:ew-resize; }',
        '#video_player { display: block; margin: 0 auto; }',
        '.info { font-family: Courier; background-color: #000; }',
        '.row { margin: 0; padding: 0; }'
    ]
})
export class VideoComponent implements OnDestroy {
    @ViewChild('vid') vid: ElementRef;

    private object: CVideo;
    private origin: Point = new Point();
    private xform: Matrix = Matrix.Identity();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private time: number;
    private wasPaused: boolean;
    private frame: number;
    private frameCount: number;
    private alive: boolean = true;
    private isMouseDown: boolean = false;
    private margin: number;
    private element: HTMLVideoElement;
    private hasMoved: boolean = false;
    private infoPadding: number = 28;
    private subs: Subscription[];
    width: number;
    height: number;

    constructor(private service: SelectionService, private changeDetectionRef : ChangeDetectorRef) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new CVideo();
        this.element = null;
        this.wasPaused = false;
        this.frame = 0;
        this.subs = [];
    }
    ngAfterViewInit() {
        this.element = this.vid.nativeElement;
        let sub = Observable.fromEvent(<any>this.element, 'timeupdate').subscribe(event => {
            this.frame = Math.floor(this.object.framerate * this.element.currentTime);
            this.frameCount = Math.floor(this.object.framerate * this.element.duration);
        });
        this.subs.push(sub);
        sub = this.service.detail.subscribe(data => {
            if (data.item && data.item != this.object) {
                setTimeout(() => this.setImage(data.item), 0);
            }
        });
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.element.pause();
        this.alive = false;
        this.subs.forEach(sub => sub.unsubscribe());
    }
    setImage(image: IItem) {
        if (!this.alive) {
            return;
        }
        this.object = <CVideo>image;
        this.element.load();
        this.xform = Matrix.Identity();
        this.xform.elements[0][0] = this.object.width;
        this.xform.elements[1][1] = this.object.height;
        this.fitToWindow();
    }
    // -- Events
    up(event: MouseEvent) {
        this.isMouseDown = false;
        this.main = this.xform;
        if (!this.hasMoved && event.button == 0) {
            if (this.wasPaused) {
                this.element.play();
            }
            else {
                this.element.pause();
            }
        }
    }
    down(event:MouseEvent) {
        if (event.button == 0) {
            this.hasMoved = false;
            this.isMouseDown = true;
            this.wasPaused = this.element.paused;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
            this.element.pause();
            this.time = this.element.currentTime;
        }
    }
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            let x:number = event.clientX - this.origin.x;

            this.element.currentTime = this.time + (x / this.object.framerate);
            this.hasMoved = true;
        }
    }
    @HostListener('window:resize')
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xform = this.main = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.fitToWindow();
    }
    center(scale:number = 1.0) {
        this.xform = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.scale(scale, scale);
        let x: number = this.object.width / 2 - this.xform.elements[0][0] / 2;
        let y: number = this.object.height / 2 - this.xform.elements[1][1] / 2;
        this.translate(x, y);

        this.main = this.xform;
    }
    original() {
        this.center();
    }
    fitToWindow() {
        let size = this.xform.rect.fit(window.innerWidth, window.innerHeight - this.infoPadding);
        let scale = size.width / this.object.width;
        this.center(scale);

        this.margin = (window.innerHeight / 2) - ((this.xform.elements[1][1] + this.infoPadding) / 2);
    }
    translate(x:number, y:number) {
        let m1:Matrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [x, y, 1]
        ]);
        let m2:Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
    scale(x:number, y:number) {
        let m1:Matrix = new Matrix([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]);
        let m2:Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
}
