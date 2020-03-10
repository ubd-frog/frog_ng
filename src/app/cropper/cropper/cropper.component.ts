import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, AfterViewChecked, HostListener } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

import { WorksService } from '../../works/works.service';
import { Point, Rect } from '../../shared/euclid';


@Component({
    selector: 'cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.css'],
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
    private origin: Point;
    private source: Rect;
    private isMouseDown: boolean;
    public rect: Rect;
    public width: number;
    public height: number;
    public visible: string = 'hide';
    public handle: string;
    public image: string;

    constructor(private service: WorksService) {
        this.rect = new Rect(0, 0, 400, 400);
        this.handle = '';
    }
    ngAfterViewChecked() {
        if (!this.item) {
            return;
        }

        let width = this.item.width;
        let height = this.item.height;
        this.image = this.item.image;
        let imgrect = new Rect(0, 0, width, height).fit(this.content.nativeElement.clientWidth - 48, this.content.nativeElement.clientHeight - 48 - 37);
        this.width = imgrect.width;
        this.height = imgrect.height;
    }
    crop() {
        let ratio: number = this.width / this.item.width;
        let v = this.rect.toArray().map((x) => { return x / ratio; });
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
    move(event: MouseEvent) {
        if (this.isMouseDown) {
            let delta: Point = new Point(event.clientX - this.origin.x, event.clientY - this.origin.y);
            let original = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            switch (this.handle) {
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
                    original.y = this.source.y + delta.y;
                    original.width = this.source.width - delta.y;
                    original.height = this.source.height - delta.y;
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
