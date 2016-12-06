import { Component, OnDestroy, AfterViewChecked, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { WorksService } from './works.service';
import { WorksThumbnailComponent } from './works-thumbnail.component';
import { IItem } from '../shared/models';
import { SelectionService } from '../shared/selection.service';


@Component({
    selector: 'works-list',
    template: `
    <works-detail></works-detail>
    <div *ngIf="loading" class='spinner'>
        working...
        <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </div>
    <h5 *ngIf="items.length === 0" class="light-green-text center-align">Nothing found</h5>
    <div class='row'>
        <thumbnail class='col m1' [class.loaded]="item.loaded" *ngFor="let item of items" [item]="item" [class.selected]="item.selected"></thumbnail>
    </div>`,
    styles: [
        '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }',
        '.col {padding: 0;}'
    ]
})
export class WorksListComponent implements OnDestroy, AfterViewInit {
    private items: IItem[] = [];
    private length: number = 0;
    private scrollcheck: boolean = false;
    private minheight: number = 0;
    private buffer: number = 300;
    private minitems: number = 300;
    private loading: boolean;
    private subs: Subscription[];

    constructor(private element: ElementRef, private service:WorksService, private selectionservice: SelectionService) {
        this.subs = [];
        let sub = this.service.results.subscribe(items => {
            this.items = items;
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
        if (this.items.length > 0 && this.length != this.items.length && this.items.length >= this.minitems) {
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