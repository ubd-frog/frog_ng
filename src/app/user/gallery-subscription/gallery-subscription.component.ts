import { Component, AfterViewInit, Input } from '@angular/core';

import { GalleryService } from '../../works/gallery.service';


@Component({
    selector: 'gallery-subscription',
    templateUrl: './gallery-subscription.component.html'
})
export class GallerySubscriptionComponent implements AfterViewInit {
    @Input() gallery;
    @Input() subscriptions;

    public weekly: boolean;
    public daily: boolean;

    constructor(public service: GalleryService) {

    }

    ngAfterViewInit() {
        for (let sub of this.subscriptions) {
            if (sub.gallery.id == this.gallery.id) {
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
