import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { StorageService } from "../../shared/storage.service";
import { TagsService } from "../tags.service";
import { UploaderService } from "../../uploader/uploader.service";
import { Tag } from "../../shared/models";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'recent-tags',
    templateUrl: './recent-tags.component.html',
    styleUrls: ['./recent-tags.component.css']
})

export class RecentTagsComponent implements OnDestroy {
    @Output() onSelect = new EventEmitter<Tag[]>();
    public tags: Tag[];
    public tagset: Tag[];
    private subs: Subscription[];
    private limit = 5;

    constructor(
        private storageservice: StorageService,
        private tagservice: TagsService,
        private uploadservice: UploaderService
    ) {
        let sub;
        this.subs = [];
        this.tags = [];
        this.tagset = [];

        sub = this.tagservice.tags.subscribe(() => {
            this.tags = storageservice.get('recent-tags', []).map(t => this.tagservice.getTagByName(t.name) || t);
            this.tagset = storageservice.get('recent-tag-set', []).map(t => this.tagservice.getTagByName(t.name) || t);
        });
        this.subs.push(sub);

        sub = this.uploadservice.tags.subscribe(tags => {
            let taglist = this.tags.filter(t => this.tags.indexOf(t) === -1);
            this.tags = tags.concat(taglist).slice(0, this.limit);

            this.storageservice.set('recent-tags', this.tags);
            if (tags.length > 1) {
                this.storageservice.set('recent-tag-set', tags);
            }
        });
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    setClickHandler() {
        this.onSelect.emit(this.tagset);
    }
    clickHandler(event: MouseEvent, tag: Tag) {
        event.stopPropagation();
        this.onSelect.emit([tag]);
    }
}
