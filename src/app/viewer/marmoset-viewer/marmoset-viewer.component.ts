import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CItem } from '../../shared/models';
import { SelectionService } from '../../shared/selection.service';
import { MarmosetService } from '../marmoset.service';


@Component({
    selector: 'marmoset-viewer',
    templateUrl: './marmoset-viewer.component.html',
    styleUrls: ['./marmoset-viewer.component.css']
})
export class MarmosetViewerComponent implements OnInit, OnDestroy {
    public object: CItem;
    private subs: Subscription[];

    constructor(private marmosetservice: MarmosetService, private service: SelectionService) {
        this.subs = [];
    }

    ngOnInit() {
        let sub = this.service.detail.distinctUntilChanged().filter(d => d.item !== null && d.item.guid.charAt(0) === '6').subscribe(data => {
            this.object = <CItem>data.item;
            this.marmosetservice.load(this.object.source);
        });
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        this.marmosetservice.hide();
    }

    @HostListener('window:resize')
    resizeEvent() {

    }

    resize(width = null, height = null) {

    }
    center() {

    }
    original() {

    }
    fitToWindow() {

    }
}