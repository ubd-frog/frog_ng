import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

import { Point, Rect } from '../shared/euclid';
import { SelectionService } from '../shared/selection.service';


@Component({
    selector: 'selection-marquee',
    templateUrl: './html/selection.html',
    styles: [
        'div { position: absolute; border: 1px solid rgb(51,153,255); background: rgba(51, 153, 255, 0.5); z-index: 1000; }'
    ]
})
export class SelectionComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;
    private element: HTMLElement;
    private origin: Point;
    private rect: Rect;
    public active: boolean;
    public isMouseDown: boolean;

    constructor(canvas: ElementRef, private service: SelectionService) {
        this.origin = new Point();
        this.active = false;
        this.rect = new Rect(0, 0, 0, 0);
    }

    ngOnInit() {

    }
    ngAfterViewInit() {
        this.element = this.canvas.nativeElement;
    }
    @HostListener('window:mouseup')
    up() {
        this.isMouseDown = false;
        this.active = false;
        document.body.classList.remove('noselect');
    }
    @HostListener('window:mousedown', ['$event'])
    down(event:MouseEvent) {
        if (event.button == 0 && event.shiftKey) {
            event.preventDefault();
            document.body.classList.add('noselect');
            this.isMouseDown = true;
            this.origin.x = event.clientX;
            this.origin.y = event.clientY;
            this.rect.zero();
            this.render();
        }
    }
    @HostListener('window:mousemove', ['$event'])
    move(event:MouseEvent) {
        if (this.isMouseDown && event.shiftKey) {
            event.preventDefault();
            let x:number = event.clientX - this.origin.x;
            let y:number = event.clientY - this.origin.y;
            this.rect.width = 0;
            this.rect.height = 0;

            if (x > 0) {
                this.rect.width = x;
                this.rect.x = this.origin.x;
            }
            else {
                this.rect.width = Math.abs(x);
                this.rect.x = this.origin.x + x;
            }
            if (y > 0) {
                this.rect.height = y;
                this.rect.y = this.origin.y;
            }
            else {
                this.rect.height = Math.abs(y);
                this.rect.y = this.origin.y + y;
            }

            if (this.active) {
                this.service.setRect(this.rect);
                this.render();
            }
            else {
                this.active = this.origin.distance(new Point(event.clientX, event.clientY)) > 10.0;
            }
        }
    }
    render() {
        let style = '';
        style += 'top: ' + (this.rect.top + window.scrollY) + 'px;';
        style += 'left: ' + this.rect.left + 'px;';
        style += 'width: ' + this.rect.width + 'px;';
        style += 'height: ' + this.rect.height + 'px;';
        this.element.setAttribute('style', style);
    }
}
