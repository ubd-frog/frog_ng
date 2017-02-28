import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { TagsService } from './tags.service';
import { Tag } from '../shared/models';
import { isInt } from "../shared/common";


@Component({
    selector: 'tag',
    template: `
    <div class="chip" [class.grey]="dark" [class.darken-3]="dark" [class.grey-text]="dark">
        <i class="material-icons left">{{(tag.id == 0) ? "search" : "label"}}</i>
        <span (click)="clickHandler($event)">{{tag.name}}</span>
        <i *ngIf="editable" class="close material-icons" (click)="closeHandler($event)">close</i>
    </div>`,
    styles: [
        '.chip, .chip > i.material-icons { height: 24px; line-height: 24px; border-radius: 2px; }',
        '.chip > i.material-icons:first-child { margin-right: 8px; font-size: 16px; height: 24px; line-height: 24px; }',
        'span { cursor: pointer; }'
    ]
})
export class TagComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() item: any;
    @Input() editable: boolean = true;
    @Input() dark: boolean = false;
    @Output() onClose = new EventEmitter<Tag>();
    @Output() onClick = new EventEmitter<Tag>();
    private tag: Tag;

    constructor(private service: TagsService) {
        this.tag = new Tag(0, '', false);

        this.service.tags.subscribe(tags => {
            if (this.tag.id) {
                this.resolveTag();
            }
        });
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (isInt(this.item)) {
                this.tag.id = parseInt(this.item);
            }
            else {
                this.tag.name = decodeURIComponent(this.item);
            }

            this.resolveTag();
        });
    }
    ngOnInit() {}
    ngOnDestroy() {}
    private resolveTag() {
        this.service.tags.subscribe(tags => {
            let tag = this.service.getTagById(this.tag.id) || this.service.getTagByName(this.tag.name);
            if (tag !== null) {
                this.tag.name = tag.name;
                this.tag.artist = tag.artist;
            }
        });
    }
    clickHandler(event: MouseEvent) {
        event.preventDefault();
        this.onClick.emit(this.tag);
    }
    closeHandler(event: MouseEvent) {
        event.preventDefault();
        this.onClose.emit(this.tag);
    }
}
