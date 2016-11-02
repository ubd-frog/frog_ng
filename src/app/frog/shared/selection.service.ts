import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { WorksService } from '../works/works.service';
import { IItem } from './models';
import { Rect } from './euclid';

export class Gallery {
    items: IItem[]
}

class DetailData {
    constructor(public item: IItem, public showComponent: boolean = true) {}
}

//
@Injectable()
export class SelectionService {
    public detail: BehaviorSubject<DetailData>;
    public selection: ReplaySubject<IItem[]>;
    public selectionRect: ReplaySubject<Rect>;
    public length: number;
    private items: IItem[];
    private allItems: IItem[];
    private selected: IItem;
    private rect: Rect;
    
    constructor(private service: WorksService) {
        this.items = [];
        this.rect = new Rect(0, 0, 0, 0);
        this.length = this.items.length;
        this.selected = null;
        this.selection = new ReplaySubject<IItem[]>();
        this.detail = new BehaviorSubject<DetailData>(new DetailData(null, false));
        this.selectionRect = new ReplaySubject<Rect>();

        this.service.results.subscribe(items => {
            this.allItems = items;
            this.clear();
        });
    }
    setDetailItem(item:IItem, showComponent: boolean = true) {
        let data: DetailData = new DetailData(item, showComponent);
        this.detail.next(data);
    }
    clearDetailItem() {
        this.detail.next(new DetailData(null, false));
    }
    selectItem(item:IItem, toggle: boolean = false) {
        this.selectItems([item], toggle);
    }
    deselectItem(item: IItem) {
        let index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
        item.selected = false;
        this.length = this.items.length;
        this.selection.next(this.items);
    }
    selectItems(items: IItem[], toggle: boolean = false) {
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
        this.rect.x = rect.x;
        this.rect.y = rect.y;
        this.rect.width = rect.width;
        this.rect.height = rect.height;
        this.selectionRect.next(this.rect);
    }
}