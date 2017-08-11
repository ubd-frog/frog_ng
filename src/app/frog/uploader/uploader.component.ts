import { Component, OnDestroy, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { BytesPipe } from './bytes.pipe';
import { UploaderService } from './uploader.service';
import { UploadFile } from './models';
import { Tag } from '../shared/models';
import {TagsService} from "../tags/tags.service";
import {ErrorService} from "../errorhandling/error.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'uploader',
    templateUrl: './html/uploader.html',
    styles: [
        'div#uploader { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',
        '.modal-content { padding-bottom: 180px; }',
        '.thumb { position: relative; padding-right: 12px; z-index: 3001; }',
        '.thumb div { position: absolute; top: 25%; left: 10%; width: 24px; height: 24px; font-size: 0px; -webkit-transition: width 0.3s, height 0.3s, font-size 1s; -moz-transition: width 0.3s, height 0.3s; -ms-transition: width 0.3s, height 0.3s; transition: width 0.3s, height 0.3s; }',
        '.thumb:hover div { width: 200px; height: 200px; }',
        '.thumb p { font-size: 0px; -webkit-transition: all 1s; -moz-transition: all 0.3s; -ms-transition: all 0.3s; transition: all 0.3s; }',
        '.thumb:hover p { font-size: 14px; }',
        '.thumb i { vertical-align: bottom; }',
        '.close { cursor: pointer; }',
        '.input-field { margin-top: 0; }',
        'input[type="text"] { margin: 0; ]}',
        '.progress { height: 8px; border-radius: 0; }'
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
    public files: UploadFile[];
    public visible: string = 'hide';
    public tags: Tag[];
    public total: number;

    constructor(
        private service: UploaderService,
        private tagsservice: TagsService,
        private errors: ErrorService
    ) {
        this.sub = this.service.requested.subscribe(show => {
            if (show && this.visible == 'hide') {
                this.tags = [];
                this.total = 0;
            }
            this.visible = (show) ? 'show': 'hide';
        }, error => this.errors.handleError(error));
        this.filesub = this.service.fileList.subscribe(files => this.files = files, error => this.errors.handleError(error));
        this.files = [];
        this.tags = [];
        this.total = 0;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.filesub.unsubscribe();
    }
    toggle() {
        this.files = [];
        this.tags = [];
        this.total = 0;
        this.service.clearFiles();
        this.visible = (this.visible == 'hide') ? 'show': 'hide';
        if (this.visible == 'hide') {

        }
    }
    upload() {
        if (this.files.length === 0 || this.tags.length === 0) {
            return;
        }
        this.total = this.files.length;
        this.service.upload(this.files, this.tags).subscribe(
            files => this.files = files,
            error => {

            },
            () => {
                this.visible = 'hide';
                this.total = 0;
            }
        );
    }
    removeHandler(file: UploadFile) {
        let index = this.files.indexOf(file);
        this.files.splice(index, 1);
    }
    addTag(event: any) {
        this.tagsservice.resolve(event.value).subscribe(tag => {
            if (tag) {
                let found = false;
                for (let t of this.tags) {
                    if (tag.id == t.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.tags.push(tag);
                }
            }
            else {
                let tag = new Tag(0, event.value);
                this.tags.push(tag);
                // this.tagsservice.create(event.value).subscribe(tag => {
                //     this.tags.push(tag);
                // }, error => this.errors.handleError(error));
            }
        }, error => this.errors.handleError(error));
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
