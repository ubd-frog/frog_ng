import { Component, AfterViewInit, Input, OnInit } from '@angular/core';

import { GalleryService } from '../../works/gallery.service';
import { Gallery } from '../../shared/models';


@Component({
    selector: 'gallery-subscription',
    templateUrl: './gallery-subscription.component.html'
})
export class GallerySubscriptionComponent implements OnInit {
    @Input() gallery;
    @Input() subscriptions;

    public weekly: boolean;
    public daily: boolean;

    constructor(public galleryservice: GalleryService) {
        this.weekly = false;
        this.daily = false;
    }

    ngOnInit() {
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

    subscribe(gallery: Gallery, frequency: number) {
        this.galleryservice.subscribe(gallery.id, frequency);
    }
}
