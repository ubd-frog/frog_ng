import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { WorksService } from "../../works/works.service";
import { GroupService } from "../group.service";

@Component({
    selector: 'group-thumbnail',
    templateUrl: './group-thumbnail.component.html',
    styleUrls: ['./group-thumbnail.component.css']
})

export class GroupThumbnailComponent implements OnDestroy {
    @Input() item;
    @ViewChild('form') form;

    public thumbnail: string;
    private subs;

    constructor(
        private element: ElementRef,
        private service: GroupService,
        private works: WorksService,
    ) {
        this.subs = [];
        this.thumbnail = '/public/pixel.png';
        setTimeout(() => { this.load(); });
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    load() {
        this.thumbnail = this.item.thumbnail;
        this.item.loaded = true;
        this.element.nativeElement.classList.add('loaded');
        let sub = this.form.valueChanges.debounceTime(500).distinctUntilChanged().subscribe(() => this.save());
        this.subs.push(sub);
    }

    save() {
        this.works.update(this.item).subscribe();
    }
}
