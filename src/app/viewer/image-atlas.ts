import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { CVideo } from '../shared/models';


export const kMaxCanvasSize = 16000;

export class ImageAtlas {
    private columns: number;
    private rows: number;
    private sub: Subscription;
    private complete: boolean;
    public canvas: any;
    public ctx: CanvasRenderingContext2D;
    public loadedFrame: BehaviorSubject<number>;

    constructor(private element: HTMLVideoElement, private item: CVideo) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = kMaxCanvasSize;
        this.canvas.height = kMaxCanvasSize;
        this.ctx = this.canvas.getContext('2d');
        this.columns = Math.floor(kMaxCanvasSize / this.item.width);
        this.rows = Math.floor(kMaxCanvasSize / this.item.height);
        this.loadedFrame = new BehaviorSubject<number>(0);
        this.complete = false;
    }
    init() {
        if (this.complete) {
            return;
        }
        this.sub = Observable.fromEvent(<any>this.element, 'seeked').subscribe(event => {
            let offset = this.getFrame(this.element.currentTime);
            this.drawFrame(offset);
        });
    }
    destroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
    getFrame(time: number) {
        return Math.round(time * this.item.framerate);
    }
    getTime(frame: number) {
        return frame / this.item.framerate;
    }
    getCoords(frame: number) {
        let row = Math.floor(frame / this.columns);
        let col = Math.round(frame % this.columns);

        return [row, col];
    }
    private drawFrame(offset) {
        this.loadedFrame.next(offset);
        let coords = this.getCoords(offset);

        this.ctx.drawImage(
            this.element,
            coords[1] * this.item.width, coords[0] * this.item.height,
            this.item.width, this.item.height
        );
        let time = this.getTime(offset + 1);
        if (time <= this.element.duration) {
            this.element.currentTime = time;
        }
        else {
            this.complete = true;
            this.sub.unsubscribe();
            this.loadedFrame.complete();
        }
    }
}
