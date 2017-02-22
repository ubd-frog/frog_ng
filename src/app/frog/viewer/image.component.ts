import { Component, Input, AfterViewInit, AfterViewChecked, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { IItem, CImage, Tag, User, Comment } from '../shared/models';
import { Point, Matrix, Rect } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';


@Component({
    selector: 'frog-image',
    template: `
    <div *ngIf="loading" class='spinner'>
        loading...
        <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </div>
    <img #img src="{{object.image}}" (mousedown)="down($event)" (mouseup)="up($event)" (mousemove)="move($event)" (mousewheel)="zoom($event)" (DOMMouseScroll)="zoomFF($event)" />
    <canvas #canvas width="{{width}}" height="{{height}}"></canvas>`,
    styles: [
        '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }',
        'canvas { cursor: move; }',
        'img { opacity: 0; width: 100%; height: 100%; position: absolute; cursor: url("//ssl.gstatic.com/ui/v1/icons/mail/images/2/openhand.cur") 7 5, default; }',
        'img:active { cursor: url("//ssl.gstatic.com/ui/v1/icons/mail/images/2/closedhand.cur") 7 5, default; }'
    ]
})
export class ImageComponent implements OnDestroy, AfterViewInit, AfterViewChecked {
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('img') img: ElementRef;

    private object: CImage;
    private origin: Point = new Point();
    private xform: Matrix = Matrix.Identity();
    private main: Matrix = Matrix.Identity();
    private scaleValue: number = 1.0;
    private axis: string;
    private loading: boolean = false;
    private isMouseDown: boolean = false;
    private ctx: CanvasRenderingContext2D;
    private element: HTMLImageElement;
    private sub;
    private dirty: boolean = false;
    private postinit: boolean = false;
    width: number;
    height: number;

    constructor(canvas: ElementRef, img: ElementRef, private service: SelectionService) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new CImage();
    }
    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.element = this.img.nativeElement;
        this.clear();

        Observable.fromEvent(<any>this.element, 'load').subscribe(event => {
            this.resize();
        });
        this.sub = this.service.detail.distinctUntilChanged().subscribe(data => {
            if (data.item) {
                setTimeout(() => this.setImage(data.item), 0);
            }
        });
    }
    ngAfterViewChecked() {
        if (this.dirty) {
            this.render();
            this.dirty = false;
        }
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    setImage(image: IItem) {
        this.object = <CImage>image;
        this.loading = !this.element.complete;
    }
    // -- Events
    up() {
        this.isMouseDown = false;
        this.main = this.xform;
    }
    down(event:MouseEvent) {
        if (event.button == 0) {
            event.preventDefault();
            this.isMouseDown = true;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
        }
    }
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            event.preventDefault();
            let x:number = event.clientX - this.origin.x;
            let y:number = event.clientY - this.origin.y;

            if (event.shiftKey) {
                if (this.object.width / this.object.height > 1.0) {
                    y = 0
                }
                else {
                    x = 0;
                }
            }

            this.xform = Matrix.Identity().x(this.main);
            this.translate(x, y);
            this.render();
        }
    }
    zoom(event:WheelEvent) {
        let scale:number = 1.0;
        if (event.deltaY < 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x:number = event.clientX;
        let y:number = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }
    zoomFF(event:WheelEvent) {
        let scale:number = 1.0;
        if (event.detail < 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x:number = event.clientX;
        let y:number = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }
    @HostListener('window:resize')
    resize() {
        this.loading = false;
        this.postinit = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.xform = this.main = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.fitToWindow();
        this.dirty = true;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    render() {
        this.clear();
        let rect = this.xform.rect;
        this.ctx.drawImage(
            this.element,
            Math.floor(rect.x),
            Math.floor(rect.y),
            Math.floor(rect.width),
            Math.floor(rect.height),
        );

        // this.renderThumbnail();
    }
    renderThumbnail() {
        let rect = this.xform.rect;
        let scale = rect.width / this.object.width;
        let offset = new Point(
            this.width - (this.object.width * 0.1) - 20,
            this.height - (this.object.height * 0.1) - 20,
        );
        let x = Math.abs(Math.min(0, rect.x / scale));
        let y = Math.abs(Math.min(0, rect.y / scale));
        let width = this.object.width - Math.abs(Math.max(0, (rect.x + rect.width - this.width) / scale));
        let height = this.object.height - Math.abs(Math.max(0, (rect.y + rect.height - this.height) / scale));

        let fullrect = new Rect(
            Math.floor(offset.x),
            Math.floor(offset.y),
            Math.floor(this.object.width * 0.1),
            Math.floor(this.object.height * 0.1)
        );
        let sourcerect = new Rect(
            x,
            y,
            width,
            height
        );
        let destrect = new Rect(
            offset.x + (x * 0.1),
            offset.y + (y * 0.1),
            width * 0.1,
            height * 0.1
        );

        this.ctx.globalAlpha = 0.5
        this.ctx.drawImage(
            this.element,
            fullrect.x, fullrect.y, fullrect.width, fullrect.height,
        );
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(
            this.element,
            sourcerect.x, sourcerect.y, sourcerect.width, sourcerect.height,
            destrect.x, destrect.y, destrect.width, destrect.height,
            // x | 0, y | 0, width | 0, height | 0,
            // (offset.x + (x * 0.1)) | 0, (offset.y + (y * 0.1)) | 0, (width * 0.1) | 0, (height * 0.1) | 0,
        );
    }
    center(scale:number = 1.0) {
        this.xform = new Matrix([
            [this.object.width, 0, 0],
            [0, this.object.height, 0],
            [0, 0, 1]
        ]);
        this.scale(scale, scale);
        let x: number = this.width / 2 - this.xform.elements[0][0] / 2;
        let y: number = this.height / 2 - this.xform.elements[1][1] / 2;
        this.translate(x, y);

        this.main = this.xform;
        this.render();
    }
    original() {
        this.center();
    }
    fitToWindow() {
        let size = this.xform.rect.fit(window.innerWidth, window.innerHeight);
        let scale = size.width / this.object.width;
        scale = (scale > 1.0) ? 1.0 : scale;
        this.center(scale);
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
