import { Injectable } from '@angular/core';


@Injectable()
export class SlideshowService {
    private timer;

    constructor() {

    }
    start(callback, timeout) {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        document.body.requestPointerLock();
        this.timer = setTimeout(() => callback(), timeout * 1000);
    }
    stop() {
        document.exitPointerLock();
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        this.timer = null;
    }
}
