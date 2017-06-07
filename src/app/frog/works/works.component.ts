import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';

import { WorksService } from './works.service';

import { SelectionService } from '../shared/selection.service';
import { StorageService } from '../shared/storage.service';
import { Notification } from '../shared/models';
import { UploaderService } from '../uploader/uploader.service';
import { NotificationService } from '../notifications/notification.service';
import { PreferencesComponent } from '../user/preferences.component';
import {Observable} from "rxjs";


@Component({
    templateUrl: './html/works.html',
    styles: [
        '#works_detail { z-index: 4000; }',
        'works-filter { position: fixed; top: 0; z-index: 900; width: 100%; }',
        'works-list { position: absolute; top: 63px; overflow-x: hidden; width: 100%; }',
        'works-list { -webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none; }'
    ]
})
export class WorksComponent {
    private guids: string[];

    constructor(
        private service: SelectionService,
        private uploader: UploaderService,
        private storage: StorageService,
        private workservice: WorksService,
        private notify: NotificationService
        ) {
        this.service.selection.subscribe(items => {
            this.guids = items.map(item => item.guid);
        });
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'd' || event.key == 'Esc' || event.key == 'Escape') {
            event.preventDefault();
            this.service.clear();
        }
        if (event.ctrlKey && event.key === 'a') {
            event.preventDefault();
            this.service.selectAll();
        }
        if (event.ctrlKey && event.key === 'c' && this.guids.length > 0) {
            event.preventDefault();
            this.storage.set('clipboard', {'guids': this.guids, 'id': null});
            this.notify.add(new Notification('Copy', 'content_copy'));
        }
        if (event.ctrlKey && event.key === 'x' && this.guids.length > 0) {
            event.preventDefault();
            this.storage.set('clipboard', {'guids': this.guids, 'id': this.workservice.id});
            this.notify.add(new Notification('Cut', 'content_cut'));
        }
        if (event.ctrlKey && event.key === 'v') {
            if (document.activeElement.tagName === 'BODY') {
                let item = this.storage.pop('clipboard');
                if (item != null) {
                    event.preventDefault();
                    this.workservice.copyItems(item.guids, item.id);
                }
            }
        }
    }
    @HostListener('window:dragenter', ['$event'])
    dragEnter(event: DragEvent) {
        let types = Array.from(event.dataTransfer.types);
        if (types.indexOf('text/html') === -1) {
            this.uploader.show();
        }
    }
    @HostListener('window:paste', ['$event'])
    pasteImage(event: ClipboardEvent) {
        let matchType = /image.*/;
        let clipboardData, found;
        found = false;
        clipboardData = event.clipboardData;
        clipboardData.types.forEach((type, i) => {
            let file, reader;
            if (found) {
                return;
            }
            if (type.match(matchType) || clipboardData.items[i].type.match(matchType)) {
                file = clipboardData.items[i].getAsFile();
                let files = clipboardData.files;
                reader = new FileReader();
                Observable.fromEvent(reader, 'load').subscribe(event => {
                    this.uploader.addFiles(files);
                    this.uploader.show();
                });
                reader.readAsDataURL(file);
                return found = true;
            }
        });
    }
}
