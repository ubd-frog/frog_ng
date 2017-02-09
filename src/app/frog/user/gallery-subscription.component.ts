import {Component, AfterViewInit, Input} from '@angular/core';

import {GalleryService} from "../works/gallery.service";


@Component({
    selector: 'gallery-subscription',
    template: `
    <div class="row">
        <div class="col s6">
            <h5>{{gallery.title}}</h5>
        </div>
        <div class="col s6">
            <input type="checkbox" class="filled-in" id="sub_weekly_{{gallery.id}}" [(ngModel)]="weekly" (change)="service.subscribe(gallery.id, 0)" />
            <label htmlFor="sub_weekly_{{gallery.id}}">Weekly</label>
            <input type="checkbox" class="filled-in" id="sub_daily_{{gallery.id}}" [(ngModel)]="daily" (change)="service.subscribe(gallery.id, 1)" />
            <label htmlFor="sub_daily_{{gallery.id}}">Daily</label>
        </div>
    </div>`
})
export class GallerySubscriptionComponent implements AfterViewInit {
    @Input() gallery;
    @Input() subscriptions;

    private weekly: boolean;
    private daily: boolean;

    constructor(private service: GalleryService) {

    }

    ngAfterViewInit() {
        for(let sub of this.subscriptions) {
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
