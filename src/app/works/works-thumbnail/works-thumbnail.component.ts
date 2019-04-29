import { Component, Input, OnDestroy, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CItem, Preferences } from '../../shared/models';
import { SelectionService } from '../../shared/selection.service';
import { WorksService } from '../works.service';
import { ViewportService } from '../viewport.service';
import { TagsService } from '../../tags/tags.service';
import { PreferencesService } from '../../user/preferences.service';



declare var $: any;


@Component({
    selector: 'thumbnail',
    templateUrl: './works-thumbnail.component.html',
    styleUrls: ['./works-thumbnail.component.css']
})
export class WorksThumbnailComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() item;

    private selecteditems: CItem[] = [];
    private ctrlKey: boolean;
    private subs: Subscription[];
    private loaded: boolean;
    public prefs: Preferences;
    public thumbnail: string;

    constructor(
        private element: ElementRef,
        private router: Router,
        private service: SelectionService,
        private worksservice: WorksService,
        private viewportservice: ViewportService,
        private tags: TagsService,
        private prefservice: PreferencesService
    ) {
        this.subs = [];
        this.thumbnail = '/public/pixel.png';
    }
    ngOnInit() {
        let sub = this.service.selectionRect.subscribe(rect => {
            let r = this.element.nativeElement.getBoundingClientRect();
            if (rect.intersects(r)) {
                this.service.selectItem(this.item);
            }
        });
        this.subs.push(sub);
        sub = this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
        this.subs.push(sub);
        sub = this.service.selection.subscribe(items => this.selecteditems = items);
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {
        let sub = this.viewportservice.guids.subscribe(guids => {
            if (guids.indexOf(this.item.guid) != -1 && !this.loaded) {
                this.loaded = true;
                setTimeout(() => { this.load(); });
            }
        });
        this.subs.push(sub);
    }
    load() {
        this.thumbnail = this.item.thumbnail;
        this.item.loaded = true;
        this.element.nativeElement.classList.add('loaded');
    }
    clickHandler(event: MouseEvent) {
        event.preventDefault();
        if (event.shiftKey) {
            this.service.selectItem(this.item, true);
        }
        else {
            let guids = [this.item.guid];
            let index = 0;
            if (this.selecteditems.length) {
                guids = this.selecteditems.map(function (x) { return x.guid; });
                index = guids.indexOf(this.item.guid);
                if (index === -1) {
                    guids.push(this.item.guid);
                    index = guids.length - 1;
                }
            }
            index = Math.max(0, index);
            let nav = ['/v', this.item.guid];
            if (guids.length > 1) {
                nav.push(guids.join(','));
            }
            if (this.worksservice.id) {
                nav.push(this.worksservice.id);
            }
            this.router.navigate(nav);
        }
    }
    like() {
        this.worksservice.likeItem(this.item);
    }
    setFocus(event) {
        this.service.setDetailItem(this.item);
    }
    setAuthor(name: string) {
        let tag = this.tags.getTagByName(name);
        if (tag != null) {
            this.router.navigate(['/w/' + this.worksservice.id + '/' + tag.id]);
        }
    }
}
