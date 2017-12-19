import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { WorksService } from '../works/works.service';
import { CItem } from './models';
import { Rect } from './euclid';

export class Gallery {
    items: CItem[]
}

class DetailData {
    constructor(public item: CItem, public showComponent: boolean = true) {}
}

//
@Injectable()
export class SelectionService {
    public detail: BehaviorSubject<DetailData>;
    public selection: ReplaySubject<CItem[]>;
    public selectionRect: ReplaySubject<Rect>;
    public length: number;
    private items: CItem[];
    private allItems: CItem[];
    private selected: CItem;
    private rect: Rect;

    constructor(private service: WorksService) {
        this.items = [];
        this.rect = new Rect(0, 0, 0, 0);
        this.length = this.items.length;
        this.selected = null;
        this.selection = new ReplaySubject<CItem[]>();
        this.detail = new BehaviorSubject<DetailData>(new DetailData(null, false));
        this.selectionRect = new ReplaySubject<Rect>();

        this.service.results.subscribe(items => {
            this.allItems = items[0];
            if (!items[1]) {
                this.clear();
            }
        });
    }
    setDetailItem(item:CItem, showComponent: boolean = true) {
        let data: DetailData = new DetailData(item, showComponent);
        this.detail.next(data);
    }
    clearDetailItem() {
        this.detail.next(new DetailData(null, false));
    }
    selectItem(item:CItem, toggle: boolean = false) {
        this.selectItems([item], toggle);
    }
    deselectItem(item: CItem) {
        let index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        item.selected = false;
        this.length = this.items.length;
        this.selection.next(this.items);
    }
    selectItems(items: CItem[], toggle: boolean = false) {
        let currentlength = this.length;
        for (let item of items) {
            let index = this.items.indexOf(item);
            if (index == -1) {
                this.items.push(item);
                item.selected = true;
            }
            else {
                if (toggle) {
                    this.items.splice(index, 1);
                    item.selected = false;
                }
            }
        }

        this.length = this.items.length;
        if (currentlength != this.length) {
            this.clearDetailItem();
            this.selection.next(this.items);
        }
    }
    clear() {
        this.items.forEach(element => {
            element.selected = false;
        });
        this.items = [];
        this.selection.next([]);
        this.length = this.items.length;
    }
    selectAll() {
        this.selectItems(this.allItems);
    }
    setRect(rect: Rect) {
        this.rect = rect;
        this.selectionRect.next(this.rect);
    }
}
