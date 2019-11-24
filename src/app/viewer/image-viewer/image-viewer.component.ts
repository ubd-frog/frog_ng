import { Component, Input, AfterViewInit, AfterViewChecked, OnDestroy, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

import { CItem, CImage, Preferences } from '../../shared/models';
import { Point, Matrix, Rect } from '../../shared/euclid';
import { SelectionService } from '../../shared/selection.service';
import { WorksService } from "../../works/works.service";
import { PreferencesService } from '../../user/preferences.service';


const kThumbnailSize = 256;


@Component({
    selector: 'frog-image',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @Input() manual: boolean;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('img') img: ElementRef;
    @Input() hide_minimap: boolean;

    private origin: Point;
    private xform: Matrix;
    private main: Matrix;
    private isMouseDown: boolean;
    private ctx: CanvasRenderingContext2D;
    private element: HTMLImageElement;
    private subs: Subscription[];
    private dirty: boolean;
    private postinit: boolean;
    private pattern: CanvasPattern;
    private tileBackground: boolean;
    private preferences: Preferences;

    public object: CImage;
    public width: number;
    public height: number;
    public percent;
    public ext: string;

    constructor(
        canvas: ElementRef,
        img: ElementRef,
        private service: SelectionService,
        private worksservice: WorksService,
        private prefservice: PreferencesService
    ) {

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.object = new CImage();
        this.tileBackground = false;
        this.subs = [];
        this.origin = new Point();
        this.xform = Matrix.Identity();
        this.main = Matrix.Identity();
    }

    ngOnInit() {
        let sub = this.prefservice.preferences.subscribe(p => {
            if (p.minimap === false) {
                this.hide_minimap = true;
            }
        });
        this.subs.push(sub);
    }

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.element = this.img.nativeElement;
        this.clear();

        if (window.navigator.userAgent.search(/edge/ig) !== -1) {
            this.hide_minimap = true;
        }

        Observable.fromEvent(<any>this.element, 'load').subscribe(event => {
            if (this.tileBackground) {
                this.pattern = this.ctx.createPattern(this.img.nativeElement, 'repeat');
            }
            this.resize();
        });
        if (!this.manual) {
            let sub = this.service.detail.distinctUntilChanged().subscribe(data => {
                if (data.item && data.item.guid.charAt(0) === '1') {
                    setTimeout(() => this.setImage(data.item), 0);
                }
            });
            this.subs.push(sub);
        }
    }
    ngAfterViewChecked() {
        if (this.dirty) {
            this.render();
            this.dirty = false;
        }
    }
    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    setImage(image: CItem) {
        this.percent = 0;
        this.object = <CImage>image;
        let parts = this.object.source.split('.');
        this.ext = parts[parts.length - 1];
    }
    // -- Events
    @HostListener('window:keypress', ['$event'])
    keyPressEvent(event: KeyboardEvent) {
        switch (event.key) {
            case 't':
                this.tileBackground = !this.tileBackground;
                this.pattern = this.ctx.createPattern(this.img.nativeElement, 'repeat');
                this.render();
                break;
            case 'p':
                this.setPanoramic();
                break;
        }
    }

    @HostListener('window:mouseup')
    up() {
        this.isMouseDown = false;
        this.main = this.xform;
    }
    upTouch(event: any) {
        this.isMouseDown = false;
        this.main = this.xform;
    }
    panStart(event: any) {
        event.preventDefault();
        this.isMouseDown = true;
        this.origin.x = event.x;
        this.origin.y = event.y;
    }
    panMove(event: any) {
        if (this.isMouseDown) {
            event.preventDefault();
            let x = event.deltaX;
            let y = event.deltaY;

            if (event.shiftKey) {
                if (this.object.width / this.object.height > 1.0) {
                    y = 0;
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
    zoom(event: WheelEvent) {
        let scale = 1.0;
        if (event.deltaY < 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x = event.clientX;
        let y = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }
    zoomFF(event: WheelEvent) {
        let scale = 1.0;
        if (event.detail < 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x = event.clientX;
        let y = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }
    zoomTouch(event: any) {
        let scale = 1.0;
        if (event.deltaY < 0) {
            scale += 0.05;
        }
        else {
            scale -= 0.05;
        }
        let x = event.clientX;
        let y = event.clientY;
        this.xform = Matrix.Identity().x(this.main);
        this.translate(-x, -y);
        this.scale(scale, scale);
        this.translate(x, y);
        this.main = this.xform;
        this.render();
    }

    @HostListener('window:resize')
    resize() {
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
        // Hack for webkit
        this.ctx.clearRect(0, 0, this.width - 1, this.height);
        this.ctx.fillRect(this.width - 1, 0, 1, this.height);
    }
    render() {
        this.clear();
        let rect = this.xform.rect;
        this.img.nativeElement.style.left = '';
        this.img.nativeElement.style.top = '';
        if (this.ext === 'gif') {
            this.img.nativeElement.style.left = (window.innerWidth / 2) - (this.object.width / 2) + 'px';
            this.img.nativeElement.style.top = (window.innerHeight / 2) - (this.object.height / 2) + 'px';
        }
        else {
            if (this.tileBackground) {
                this.ctx.fillStyle = this.pattern;
                this.ctx.fillRect(0, 0, this.width, this.height);
            }

            this.ctx.drawImage(
                this.element,
                Math.floor(rect.x),
                Math.floor(rect.y),
                Math.floor(rect.width),
                Math.floor(rect.height),
            );

            if (window.innerWidth < 1080) {
                return;
            }

            if (!this.hide_minimap) {
                this.renderThumbnail();
            }
        }
    }
    renderThumbnail() {
        let rect = this.xform.rect;
        let minscale, scale;

        const imgwidth = this.element.naturalWidth;
        const imgheight = this.element.naturalHeight;

        if (imgwidth >= this.object.height) {
            minscale = kThumbnailSize / imgwidth;
            scale = rect.width / imgwidth;
        }
        else {
            minscale = kThumbnailSize / imgheight;
            scale = rect.height / imgheight;
        }

        let offset = new Point(
            this.width - (imgwidth * minscale) - 20,
            this.height - (imgheight * minscale) - 20,
        );
        let x = Math.abs(Math.min(0, rect.x / scale));
        let y = Math.abs(Math.min(0, rect.y / scale));
        let width = imgwidth - Math.abs(Math.max(0, (rect.x + rect.width - this.width) / scale)) - x;
        let height = imgheight - Math.abs(Math.max(0, (rect.y + rect.height - this.height) / scale)) - y;

        let fullrect = new Rect(
            Math.floor(offset.x),
            Math.floor(offset.y),
            Math.floor(imgwidth * minscale),
            Math.floor(imgheight * minscale)
        );
        let sourcerect = new Rect(
            x,
            y,
            width,
            height
        );
        let destrect = new Rect(
            offset.x + (x * minscale),
            offset.y + (y * minscale),
            width * minscale,
            height * minscale
        );

        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
            this.element,
            fullrect.x, fullrect.y, fullrect.width, fullrect.height,
        );
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(
            this.element,
            sourcerect.x, sourcerect.y, sourcerect.width, sourcerect.height,
            destrect.x, destrect.y, destrect.width, destrect.height,
        );
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(destrect.x + 0.5, destrect.y + 0.5, destrect.width, destrect.height);
    }
    center(scale = 1.0) {
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
    translate(x: number, y: number) {
        let m1: Matrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [x, y, 1]
        ]);
        let m2: Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
    scale(x: number, y: number) {
        let m1: Matrix = new Matrix([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]);
        let m2: Matrix = this.xform.x(m1);
        this.xform = m2.dup();
    }
    setPanoramic() {
        this.object.panoramic = !this.object.panoramic;
        this.worksservice.update(this.object, { 'panoramic': this.object.panoramic }).subscribe();
    }
}
