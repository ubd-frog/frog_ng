import { Injectable } from '@angular/core';

import { Subscription, BehaviorSubject, Observable } from 'rxjs';

import { IItem } from '../shared/models';
import { Rect } from '../shared/euclid';
import { WorksService } from './works.service';

@Injectable()
export class ViewportService {
    public viewport: BehaviorSubject<Rect>;
    public guids: BehaviorSubject<string[]>;
    private sub: Subscription;
    private items: IItem[];

    constructor(private service: WorksService) {
        this.viewport = new BehaviorSubject<Rect>(new Rect());
        this.guids = new BehaviorSubject<string[]>([]);
        this.sub = this.service.results.subscribe(items => {
            this.items = items[0];
            this.guids.next(this.visibleGuids());
        });
        Observable.fromEvent(window, 'scroll').subscribe(() => {
            let rect = new Rect();
            this.viewport.next(rect);
            this.guids.next(this.visibleGuids());
        });
    }
    private visibleGuids(): string[] {
        let guids = [];
        // -- Should fix this, guessing at best here
        let width = 200;
        let thumbs = document.getElementsByTagName('thumbnail');
        if (thumbs.length > 0) {
            width = thumbs[0].clientWidth;
        }
        let cols = Math.floor(window.innerWidth / width);
        let rows = Math.ceil(window.innerHeight / width) + 1;
        let start = Math.floor(window.scrollY / width) * cols;
        let length = rows * cols;
        length = Math.min(this.items.length, start + length);
        for (let i=start;i<length;++i) {
            guids.push(this.items[i].guid);
        }

        return guids;
    }
}
