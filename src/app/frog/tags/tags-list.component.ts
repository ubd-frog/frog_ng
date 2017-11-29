import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, OnDestroy, AfterViewChecked, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { Subscription } from 'rxjs';

import { TagsService } from './tags.service';
import { Tag } from '../shared/models';
import {Router} from "@angular/router";

@Component({
    selector: 'tags-list',
    templateUrl: './html/tags-list.html',
    styles: [
        'div#modal { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',
        '.root { font-weight: bold; }',
        '.modal-content { overflow: hidden; height: 100%; }',
        '.modal-content > div.row { height: 86%; }',
        '.modal-content div.row .col:first-child { height: 100%; }',
        '.modal-content div.row .col:first-child > div:last-child { overflow-y: auto; height: 100%; }',
        '.switch { display: inline; }',
        'span.badge { right: 64px; }',
        'a { cursor: pointer; }',
        '.tag-item { cursor: pointer; }'
    ],
    animations: [
        trigger('panelState', [
            state('show', style({
                display: 'block'
            })),
            state('hide', style({
                display: 'none'
            }))
        ])
    ]
})
export class TagsListComponent implements OnDestroy {
    private _tags: Tag[] = [];
    private subs: Subscription[] = [];
    private order: boolean = true;
    private edit: number = -1;
    private editfield: string = '';
    private deleteCheck: number = -1;
    public tags: Tag[] = [];
    public merge: Tag[] = [];
    public visible: string = 'hide';
    public showall: boolean = false;

    constructor(private service: TagsService, private router: Router) {
        this.subs.push(service.contentTags.subscribe(tags => {
            this.tags = tags;
            this._tags = this.tags.slice(0);
            this.merge = [];
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    close() {
        this.visible = 'hide';
    }
    show() {
        this.service.getTagWithCount();
        this.visible = 'show';
    }
    toggleSelection(tag: Tag) {
        this.deleteCheck = -1;
        let index = this.merge.indexOf(tag);
        if (index != -1) {
            this.merge.splice(index, 1);
        }
        else {
            this.merge.push(tag);
        }
    }
    submit(event) {
        event.preventDefault();
        if (this.merge.length > 1) {
            this.service.merge(this.merge.map(tag => { return tag.id; }));
        }
    }
    sortBy(attr: string) {
        this.tags.sort((a, b) => {
            let x = a[attr];
            let y = b[attr];
            if (typeof x === 'string') {
                x = x.toLowerCase();
                y = y.toLowerCase();
            }
            if (x > y) {
                return 1;
            }
            else if (y > x) {
                return -1;
            }
            return 0;
        });
        if (this.order) {
            this.tags.reverse();
        }

        this.order = !this.order;
        this.edit = -1;
    }
    toggleFilter() {
        this.edit = -1;
        if (this.showall) {
            this.tags = this._tags.filter(value => { return true; });
        }
        else {
            this.tags = this._tags.filter(value => { return value.count == 0; });
        }
    }
    editTag(index: number) {
        this.edit = index;
        this.editfield = this.tags[index].name;
    }
    saveEdit() {
        this.tags[this.edit].name = this.editfield;
        this.service.rename(this.tags[this.edit]).subscribe(() => {
            this.editfield = '';
            this.edit = -1;
        });
    }
    remove(event, tag: Tag) {
        event.preventDefault();
        event.stopPropagation();
        let index = this.tags.indexOf(tag);
        if (this.deleteCheck != index) {
            this.deleteCheck = index
            return;
        }
        this.deleteCheck = -1;
        this.tags.splice(index, 1);
        this.service.remove(tag).subscribe();
    }
    queryAll(event: MouseEvent, tag: Tag) {
        event.stopPropagation();
        event.preventDefault();
        this.close();
        this.router.navigate(['/w/0', tag.id]);
    }
}
