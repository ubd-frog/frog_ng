import { Component, OnDestroy, AfterViewInit, HostListener, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { WorksService } from '../works.service';
import { CItem, Preferences } from '../../shared/models';
import { SelectionService } from '../../shared/selection.service';
import { PreferencesService } from '../../user/preferences.service';


const MIME_TYPES = {
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mov': 'video/quicktime',
    'avi': 'video/msvideo',
    'mpg': 'video/mpeg',
    'psd': 'image/vnd.adobe.photoshop',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'mp4': 'video/mp4'
};


@Component({
    selector: 'works-list',
    templateUrl: './works-list.component.html',
    styleUrls: ['./works-list.component.css']
})
export class WorksListComponent implements OnDestroy, AfterViewInit {
    private length = 0;
    private scrollcheck = false;
    private minheight = 0;
    private buffer = 300;
    private subs: Subscription[];
    public loading: boolean;
    public items: CItem[] = [];
    public prefs: Preferences;

    constructor(
        private element: ElementRef,
        private service: WorksService,
        private selectionservice: SelectionService,
        private prefservice: PreferencesService
    ) {
        this.subs = [];
        let sub = this.service.results.subscribe(items => {
            if (this.items.length !== items[0].length) {
                this.length = 0;
                this.minheight = 0;
                window.scrollTo(0, this.service.scrollpos);
            }
            this.items = items[0];
        });
        this.subs.push(sub);
        sub = this.service.loading.subscribe(loading => this.loading = loading);
        this.subs.push(sub);
        sub = this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
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
        if (this.items.length > 0 && this.length !== this.items.length && this.items.length >= this.service.minitems) {
            this.length = this.items.length;
            this.scrollcheck = true;
        }
        this.service.scrollpos = window.scrollY;
        let height = this.element.nativeElement.clientHeight;
        if (this.scrollcheck && height > this.minheight) {
            let heightDelta = height - window.scrollY;

            if (heightDelta < window.innerHeight + this.buffer) {
                this.service.get(-1, true);
                this.minheight = height;
            }
        }
    }
    private splitPath(path: string) {
        return (/[.]/.exec(path)) ? /[^.]+$/.exec(path)[0] : undefined;
    }
    dragStartHandler(event: DragEvent, item: CItem) {
        if (item.guid.charAt(0) === '4') {
            return;
        }
        event.stopImmediatePropagation();
        let mime = MIME_TYPES[this.splitPath(item.source)];
        let name = item.title.replace(/[\.\s]/g, '_');
        let filedata = `${mime}:${name}:${window.location.origin}${item.source}`;
        let r = event.dataTransfer.setData("DownloadURL", filedata);
    }
}
