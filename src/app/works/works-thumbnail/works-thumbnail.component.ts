import { Component, Input, OnDestroy, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { WorksService } from '../works.service';
import { ViewportService } from '../viewport.service';
import { CItem, Preferences, Tag, SiteConfig } from '../../shared/models';
import { TagsService } from '../../tags/tags.service';
import { SelectionService } from '../../shared/selection.service';
import { PreferencesService } from '../../user/preferences.service';
import { SiteConfigService } from '../../siteconfig';
import { ErrorService } from '../../errorhandling/error.service';


declare var $: any;


@Component({
    selector: 'thumbnail',
    templateUrl: './works-thumbnail.component.html',
    styleUrls: ['./works-thumbnail.component.css']
})
export class WorksThumbnailComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() item;
    @ViewChild('img') img: ElementRef;

    private selecteditems: CItem[] = [];
    private ctrlKey: boolean;
    private subs: Subscription[];
    private viewportsub: Subscription;
    private loaded: boolean;
    public assettype: string;
    public prefs: Preferences;
    public thumbnail: string;
    public siteconfig: SiteConfig;
    public link: string;

    constructor(
        private element: ElementRef,
        private router: Router,
        private service: SelectionService,
        private worksservice: WorksService,
        private viewportservice: ViewportService,
        private tags: TagsService,
        private prefservice: PreferencesService,
        private siteconfigservice: SiteConfigService,
        private errors: ErrorService
    ) {
        this.subs = [];
        this.thumbnail = 'assets/pixel.png';
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
        sub = this.siteconfigservice.siteconfig.subscribe(data => {
            this.siteconfig = data;
        });
        this.subs.push(sub);
        sub = this.service.selection.subscribe(items => this.selecteditems = items);
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe()
        });
    }
    ngAfterViewInit() {
        switch (this.item.guid.charAt(0)) {
            case '2':
                this.assettype = 'video';
                break;
            case '4':
                this.assettype = 'image-multiple';
                break;
            case '6':
                this.assettype = 'cube';
                this.thumbnail = 'assets/cube.png'
                break;
        }
        this.viewportsub = this.viewportservice.guids.subscribe(guids => {
            if (guids.indexOf(this.item.guid) !== -1 && !this.loaded) {
                this.loaded = true;
                setTimeout(() => { this.load(); });
            }
        });
    }
    load() {
        if (this.item.thumbnail) {
            this.thumbnail = this.item.thumbnail;
        }

        this.item.loaded = true;
        this.element.nativeElement.classList.add('loaded');
        this.link = `/v/0/${this.item.guid}`;
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
        this.item.selected = true;
    }
    setAuthor(name: string) {
        let tag = this.tags.getTagByName(name);
        if (tag != null) {
            this.router.navigate(['/w/' + this.worksservice.id + '/' + tag.id]);
        }
    }
    removeTag(tag: Tag) {
        this.worksservice.editTags([this.item], [], [tag]).subscribe(result => {
            this.item.tags = result[0].tags;
        }, error => this.errors.handleError(error));
    }
}
