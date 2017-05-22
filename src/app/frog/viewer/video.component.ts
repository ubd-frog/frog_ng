import { Component, Input, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { IItem, CVideo, Tag, User, Comment } from '../shared/models';
import { Point, Matrix, Rect } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';


const kWidth = 999;
const kHeight = 566;


@Component({
    selector: 'frog-video',
    templateUrl: './html/video.html',
    styles: [
        'video, canvas { width: 100%; height: 100%; cursor:ew-resize; }',
        '#video_player { display: block; margin: 0 auto; }',
        '.info { font-family: Courier; background-color: #000; }',
        '.row { margin: 0; padding: 0; }'
    ]
})
export class VideoComponent implements OnDestroy {
    @ViewChild('vid') vid: ElementRef;
    @ViewChild('viewport') viewport: ElementRef;

    private origin: Point = new Point();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private time: number;
    private wasPaused: boolean;
    private alive: boolean = true;
    private isMouseDown: boolean = false;
    private element: HTMLVideoElement;
    private ctx: CanvasRenderingContext2D;
    private vctx: CanvasRenderingContext2D;
    private hasMoved: boolean = false;
    private infoPadding: number = 28;
    private subs: Subscription[];
    private images: boolean;
    private currentframe: number;
    private canvas: any;
    public xform: Matrix = Matrix.Identity();
    public frame: number;
    public frameCount: number;
    public margin: number;
    public object: CVideo;
    public width: number;
    public height: number;
    public loadedframe: number;

    constructor(viewport: ElementRef, private service: SelectionService, private changeDetectionRef : ChangeDetectorRef) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new CVideo();
        this.element = null;
        this.wasPaused = false;
        this.frame = 0;
        this.subs = [];
        this.images = false;
        this.currentframe = 0;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 16000;
        this.canvas.height = 16000;
    }
    ngAfterViewInit() {
        this.element = this.vid.nativeElement;
        this.ctx = this.canvas.getContext('2d');
        this.vctx = this.viewport.nativeElement.getContext('2d');
        let sub = Observable.fromEvent(<any>this.element, 'timeupdate').subscribe(event => {
            this.frame = Math.floor(this.object.framerate * this.element.currentTime);
            this.frameCount = Math.floor(this.object.framerate * this.element.duration);
        });
        this.subs.push(sub);
        sub = Observable.fromEvent(<any>this.element, 'seeked').subscribe(event => {
            let offset = this.element.currentTime * this.object.framerate;
            this.drawFrame(offset);
        });
        this.subs.push(sub);
        sub = Observable.fromEvent(<any>this.element, 'canplaythrough').subscribe(event => {
            setTimeout(() => this.imageArray(), 0);
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
        let x:number = event.clientX - this.origin.x;
        this.currentframe = Math.floor(this.currentframe + x / 6);
        //
        // this.main = this.xform;
        // if (!this.hasMoved && event.button == 0) {
        //     if (this.wasPaused) {
        //         this.element.play();
        //     }
        //     else {
        //         this.element.pause();
        //     }
        // }
    }
    down(event:MouseEvent) {
        if (event.button == 0) {
            // this.hasMoved = false;
            this.isMouseDown = true;
            // this.wasPaused = this.element.paused;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
            // this.element.pause();
            // this.time = this.element.currentTime;
            // let frame = Math.floor(this.time + (x / this.object.framerate));
        }
    }
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            let x:number = event.clientX - this.origin.x;
            // let frame = Math.floor(this.time + (x / this.object.framerate));
            let frame = Math.floor(this.currentframe + x / 6) % 120;
            if (frame < 0) {
                frame = 120 + frame;
            }
            this.loadedframe = frame;
            let cols = 16000 / 999;
            let row = Math.floor(frame / cols);
            let col = Math.round(frame % cols);
            this.vctx.drawImage(
                this.canvas,
                col * kWidth, row * kHeight, kWidth, kHeight,
                0, 0, kWidth, kHeight
            )
            // this.element.currentTime = this.time + (x / this.object.framerate);
            // this.hasMoved = true;
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
    imageArray() {
        if (!this.images) {
            this.images = true;
            let count = Math.floor(this.object.framerate * this.element.duration);
            // this.canvas.nativeElement.width = kWidth * count;
            setTimeout(() => this.element.currentTime = 0 / this.object.framerate, 0);
        }
    }
    drawFrame(offset) {
        this.loadedframe = offset;
        let cols = 16000 / 999;
        let row = Math.floor(offset / cols);
        let col = Math.round(offset % cols);
        this.ctx.drawImage(
            this.element,
            col * kWidth,
            row * kHeight,
            kWidth,
            kHeight
        );
        let time = (offset + 1) / this.object.framerate;
        if (time < this.element.duration) {
            setTimeout(() => this.element.currentTime = (offset + 1) / this.object.framerate, 0);
        }
    }
}
