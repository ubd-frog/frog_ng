import { Component, OnDestroy, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { BytesPipe } from './bytes.pipe';
import { UploaderService } from './uploader.service';
import { UploadFile } from './models';
import { Tag } from '../shared/models';

@Component({
    selector: 'uploader',
    templateUrl: './html/uploader.html',
    styles: [
        'div#uploader { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',
        '.modal-content { padding-bottom: 180px; }',
        '.thumb { position: relative; padding-right: 12px; }',
        '.thumb div { position: absolute; top: 25%; left: 10%; width: 24px; height: 24px; -webkit-transition: width 0.3s, height 0.3s; -moz-transition: width 0.3s, height 0.3s; -ms-transition: width 0.3s, height 0.3s; transition: width 0.3s, height 0.3s; }',
        '.thumb:hover div { width: 200px; height: 200px; }',
        '.close { cursor: pointer; }'
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
export class UploaderComponent implements OnDestroy {
    private sub;
    private filesub;
    private files: UploadFile[];
    private visible: string = 'hide';
    private tags: Tag[];
    private total: number;

    constructor(private service: UploaderService) {
        this.sub = this.service.requested.subscribe(show => {
            if (show && this.visible == 'hide') {
                this.tags = [];
                this.total = 0;
            }
            this.visible = (show) ? 'show': 'hide';
        });
        this.filesub = this.service.fileList.subscribe(files => this.files = files);
        this.files = [];
        this.tags = [];
        this.total = 0;
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
        this.filesub.unsubscribe();
    }
    toggle() {
        this.visible = (this.visible == 'hide') ? 'show': 'hide';
        if (this.visible == 'hide') {
            this.files.length = 0;
        }
    }
    upload() {
        if (this.files.length === 0 || this.tags.length === 0) {
            return;
        }
        this.total = this.files.length;
        this.service.upload(this.files, this.tags).subscribe(files => {
            this.files = files;
        }, () => {}, () => {
            this.visible = 'hide';
            this.total = 0;
        });
    }
    removeHandler(file: UploadFile) {
        let index = this.files.indexOf(file);
        this.files.splice(index, 1);
    }
    addTag(event: any) {
        this.tags.push(event.tag);
    }
    removeTag(tag: Tag) {
        let index = this.tags.indexOf(tag);
        this.tags.splice(index, 1);
    }
    drop(event: DragEvent) {
        if (event.dataTransfer.files.length) {
            event.preventDefault();
            this.service.addFiles(event.dataTransfer.files);
        }
    }
}
