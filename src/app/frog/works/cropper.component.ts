import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, OnDestroy, AfterViewChecked, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { WorksService } from './works.service';
import { Point, Rect } from '../shared/euclid';


@Component({
    selector: 'cropper',
    template: `
    <div [@panelState]="visible" id="modal" (drop)="drop($event)" (dragover)="false" (dragend)="false">
        <div (mousemove)="move($event)" class="modal open modal-fixed-footer">
            <div #content class="modal-content">
                <h4>Create a Square Thumbnail</h4>
                <div style="width: 100%; height: 90%;">
                    <div #view (mousedown)="down($event)" class="cropper-container cropper-bg" [style.width.px]="width" [style.height.px]="height">
                        <div class="cropper-wrap-box">
                            <div class="cropper-canvas">
                                <img src="{{item?.image}}">
                            </div>
                        </div>
                        <div class="cropper-drag-box cropper-modal"></div>
                        <div class="cropper-crop-box" [style.width.px]="rect.width" [style.height.px]="rect.height" [style.top.px]="rect.y" [style.left.px]="rect.x">
                            <span class="cropper-view-box">
                                <img src="{{item?.image}}" [style.width.px]="width" [style.height.px]="height" [style.margin-left.px]="-rect.x" [style.margin-top.px]="-rect.y">
                            </span>
                            <span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span>
                            <span class="cropper-center"></span><span (mousedown)="handle='center'" class="cropper-face cropper-move"></span>
                            <span class="cropper-line line-e" (mousedown)="handle='e'"></span>
                            <span class="cropper-line line-n" (mousedown)="handle='n'"></span>
                            <span class="cropper-line line-w" (mousedown)="handle='w'"></span>
                            <span class="cropper-line line-s" (mousedown)="handle='s'"></span>
                            <span class="cropper-point point-e" (mousedown)="handle='e'"></span>
                            <span class="cropper-point point-n" (mousedown)="handle='n'"></span>
                            <span class="cropper-point point-w" (mousedown)="handle='w'"></span>
                            <span class="cropper-point point-s" (mousedown)="handle='s'"></span>
                            <span class="cropper-point point-ne" (mousedown)="handle='ne'"></span>
                            <span class="cropper-point point-nw" (mousedown)="handle='nw'"></span>
                            <span class="cropper-point point-sw" (mousedown)="handle='sw'"></span>
                            <span class="cropper-point point-se" (mousedown)="handle='se'"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a (click)="close()" class="waves-effect waves-red btn-flat">Cancel</a>
                <a (click)="crop()" class="waves-effect waves-green btn">Crop</a>
            </div>
        </div>
    </div>`,
    styles: [
        'div#modal { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',

        '.cropper-container {font-size: 0;line-height: 0;position: relative;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;direction: ltr !important;-ms-touch-action: none;touch-action: none;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none; margin: 0 auto; }',
        '.cropper-wrap-box {overflow: hidden;}',
        '.cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal {position: absolute;top: 0;right: 0;bottom: 0;left: 0;}',
        '.cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal {position: absolute;top: 0;right: 0;bottom: 0;left: 0;}',
        '.cropper-container img {display: block;width: 100%;min-width: 0 !important;max-width: none !important;height: 100%;min-height: 0 !important;max-height: none !important;image-orientation: 0deg !important;}',
        'img.cropper, .cropper-container img {max-width: 567px;}',
        '.cropper-drag-box {opacity: 0;background-color: #fff;filter: alpha(opacity=0);}',
        '.cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal {position: absolute;top: 0;right: 0;bottom: 0;left: 0;}',
        '.cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal {position: absolute;top: 0;right: 0;bottom: 0;left: 0;}',
        '.cropper-view-box {display: block;overflow: hidden;width: 100%;height: 100%;outline: 1px solid #39f;outline-color: rgba(51,153,255,0.75);}',
        '.cropper-container img {display: block;width: 100%;min-width: 0 !important;max-width: none !important;height: 100%;min-height: 0 !important;max-height: none !important;image-orientation: 0deg !important;}',
        'img.cropper, .cropper-container img {max-width: 567px;}',
        '.cropper-dashed.dashed-h {top: 33.33333%;left: 0;width: 100%;height: 33.33333%;border-top-width: 1px;border-bottom-width: 1px;}',
        '.cropper-dashed {position: absolute;display: block;opacity: .5;border: 0 dashed #eee;filter: alpha(opacity=50);}',
        '.cropper-dashed.dashed-v {top: 0;left: 33.33333%;width: 33.33333%;height: 100%;border-right-width: 1px;border-left-width: 1px;}',
        '.cropper-modal {opacity: .5;background-color: #000;filter: alpha(opacity=50);}',
        '.cropper-center {position: absolute;top: 50%;left: 50%;display: block;width: 0;height: 0;opacity: .75;filter: alpha(opacity=75);}',
        '.cropper-center:before {top: 0;left: -3px;width: 7px;height: 1px;}',
        '.cropper-center:before, .cropper-center:after {position: absolute;display: block;content: " ";background-color: #eee;}',
        '*:before, *:after {box-sizing: border-box;}',
        '.cropper-center:after {top: -3px;left: 0;width: 1px;height: 7px;}',
        '.cropper-center:before, .cropper-center:after {position: absolute;display: block;content: " ";background-color: #eee;}',
        '.cropper-face, .cropper-line, .cropper-point {position: absolute;display: block;width: 100%;height: 100%;opacity: .1;filter: alpha(opacity=10);}',
        '.cropper-move {cursor: move;}',
        '.cropper-face {top: 0;left: 0;background-color: #fff;}',
        '.cropper-face, .cropper-line, .cropper-point {position: absolute;display: block;width: 100%;height: 100%;opacity: .1;filter: alpha(opacity=10);}',
        '.cropper-face, .cropper-line, .cropper-point {position: absolute;display: block;width: 100%;height: 100%;opacity: .1;filter: alpha(opacity=10);}',
        '.cropper-line.line-e {top: 0;right: -3px;width: 5px;cursor: e-resize;}',
        '.cropper-line {background-color: #39f;}',
        '.cropper-line.line-n {top: -3px;left: 0;height: 5px;cursor: n-resize;}',
        '.cropper-line.line-w {top: 0;left: -3px;width: 5px;cursor: w-resize;}',
        '.cropper-line.line-s {bottom: -3px;left: 0;height: 5px;cursor: s-resize;}',
        '.cropper-point {width: 5px;height: 5px;opacity: .75;background-color: #39f;filter: alpha(opacity=75);}',
        '.cropper-point.point-e {top: 50%;right: -3px;margin-top: -3px;cursor: e-resize;}',
        '.cropper-point.point-n {top: -3px;left: 50%;margin-left: -3px;cursor: n-resize;}',
        '.cropper-point.point-w {top: 50%;left: -3px;margin-top: -3px;cursor: w-resize;}',
        '.cropper-point.point-s {bottom: -3px;left: 50%;margin-left: -3px;cursor: s-resize;}',
        '.cropper-point.point-ne {top: -3px;right: -3px;cursor: ne-resize;}',
        '.cropper-point.point-nw {top: -3px;left: -3px;cursor: nw-resize;}',
        '.cropper-point.point-sw {bottom: -3px;left: -3px;cursor: sw-resize;}',
        '.cropper-point.point-se {width: 5px;height: 5px;right: -3px;cursor: se-resize;}',
    ],
    animations: [
        trigger('panelState', [
            state('show', style({
                display: 'block'
            })),
            state('hide', style({
                display: 'none'
            }))
        ])
    ]
})
export class CropperComponent implements AfterViewChecked {
    @Input() item;
    @Output() onCrop = new EventEmitter();
    @ViewChild('content') content: ElementRef;
    private rect: Rect;
    private origin: Point;
    private source: Rect;
    private handle: string;
    private isMouseDown: boolean;
    private width: number;
    private height: number;
    private visible: string = 'hide';

    constructor(private service: WorksService) {
        this.rect = new Rect(0, 0, 400, 400);
        this.handle = '';
    }
    ngAfterViewChecked() {
        if (!this.item) {
            return;
        }
        let imgrect = new Rect(0, 0, this.item.width, this.item.height).fit(this.content.nativeElement.clientWidth - 48, this.content.nativeElement.clientHeight - 48 - 37);
        this.width = imgrect.width;
        this.height = imgrect.height;
    }
    crop() {
        let ratio: number = this.width / this.item.width;
        let v = this.rect.toArray().map((x) => {return x / ratio;})
        this.service.cropItem(this.item, v[0], v[1], v[0] + v[2], v[1] + v[3]).subscribe(item => {
            this.item = item;
            item.thumbnail += '?foo=' + new Date().getTime();
            this.service.addItems([item]);
            this.close();
            this.onCrop.emit(item);
        });
    }
    close() {
        this.visible = 'hide';
    }
    show() {
        this.visible = 'show';
    }
    @HostListener('window:mouseup')
    up() {
        this.isMouseDown = false;
    }
    down(event: MouseEvent) {
        this.isMouseDown = true;
        this.origin = new Point(event.clientX, event.clientY);
        this.source = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    move(event:MouseEvent) {
        if (this.isMouseDown) {
            let delta: Point = new Point(event.clientX - this.origin.x, event.clientY - this.origin.y);
            let original = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            switch(this.handle) {
                case 'center':
                    original.x = this.source.x + delta.x;
                    original.y = this.source.y + delta.y;
                    break;
                case 'e':
                    original.y = this.source.y - (delta.x / 2);
                    original.width = this.source.width + delta.x;
                    original.height = this.source.height + delta.x;
                    break;
                case 'w':
                    original.x = this.source.x + delta.x;
                    original.y = this.source.y + (delta.x / 2);
                    original.width = this.source.width - delta.x;
                    original.height = this.source.height - delta.x;
                    break;
                case 'n':
                    original.x = this.source.x + (delta.y / 2);
                    original.y = this.source.y + delta.y;
                    original.width = this.source.width - delta.y;
                    original.height = this.source.height - delta.y;
                    break;
                case 's':
                    original.x = this.source.x - (delta.y / 2);
                    original.width = this.source.width + delta.y;
                    original.height = this.source.height + delta.y;
                    break;
                case 'ne':
                    original.y = this.source.y - delta.y;
                    original.width = this.source.width + delta.y;
                    original.height = this.source.height + delta.y;
                    break;
                case 'se':
                    original.width = this.source.width + delta.x;
                    original.height = this.source.height + delta.x;
                    break;
                case 'nw':
                    original.x = this.source.x + delta.y;
                    original.y = this.source.y + delta.y;
                    original.width = this.source.width - delta.y;
                    original.height = this.source.height - delta.y;
                    break;
                case 'sw':
                    original.x = this.source.x + delta.x;
                    original.width = this.source.width - delta.x;
                    original.height = this.source.height - delta.x;
                    break;
            }
            
            original.clamp(this.width, this.height);
            original.width = original.height;
            this.rect = original;
        }
    }
}