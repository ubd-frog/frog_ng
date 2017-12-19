import { Component, OnDestroy, AfterViewChecked, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { WorksService } from './works.service';
import { WorksThumbnailComponent } from './works-thumbnail.component';
import { CItem } from '../shared/models';
import { SelectionService } from '../shared/selection.service';


@Component({
    selector: 'works-list',
    templateUrl: './html/works-list.html',
    styles: [
        '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }',
        '.col {padding: 0;}',
        'works-detail { user-select: initial; }'
    ]
})
export class WorksListComponent implements OnDestroy, AfterViewInit {
    private length: number = 0;
    private scrollcheck: boolean = false;
    private minheight: number = 0;
    private buffer: number = 300;
    private subs: Subscription[];
    public loading: boolean;
    public items: CItem[] = [];

    constructor(private element: ElementRef, private service:WorksService, private selectionservice: SelectionService) {
        this.subs = [];
        let sub = this.service.results.subscribe(items => {
            if (this.items.length != items[0].length) {
                this.length = 0;
                this.minheight = 0;
                window.scrollTo(0, this.service.scrollpos);
            }
            this.items = items[0];
        });
        this.subs.push(sub);
        sub = this.service.loading.subscribe(loading => this.loading = loading);
        this.subs.push(sub);

        this.selectionservice.clearDetailItem();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {
        window.scrollTo(0, this.service.scrollpos);
    }
    @HostListener('window:scroll')
    scroll() {
        if (this.loading) {
            return;
        }
        if (this.items.length > 0 && this.length != this.items.length && this.items.length >= this.service.minitems) {
            this.length = this.items.length;
            this.scrollcheck = true;
        }
        this.service.scrollpos = window.scrollY;
        let height = this.element.nativeElement.clientHeight;
        if (this.scrollcheck && height > this.minheight) {
            let heightDelta = height - window.scrollY;

            if (heightDelta < window.innerHeight + this.buffer) {
                this.service.get(0, true);
                this.minheight = height;
            }
        }

    }
}
