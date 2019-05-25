import { Component, AfterViewInit, Input } from '@angular/core';

import { Gallery } from '../../shared/models';
import { GalleryService } from '../../works/gallery.service';


class Subscription {
    id: number;
    gallery: Gallery;
    frequency: number;
}


@Component({
    selector: 'gallery-subscription',
    templateUrl: './gallery-subscription.component.html'
})
export class GallerySubscriptionComponent implements AfterViewInit {
    @Input() gallery;
    @Input() subscriptions: Subscription[] = [];

    public weekly: boolean;
    public daily: boolean;

    constructor(public service: GalleryService) {

    }

    ngAfterViewInit() {
        if (!this.subscriptions) {
            return;
        }
        for (let sub of this.subscriptions) {
            if (sub.gallery.id === this.gallery.id) {
                switch (sub.frequency) {
                    case 0:
                        this.weekly = true;
                        break;
                    case 1:
                        this.daily = true;
                        break;
                }
            }
        }
    }
}
