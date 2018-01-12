import {Component, OnDestroy, HostListener} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UploaderService } from './uploader.service';
import { UploadFile } from './models';
import { Tag } from '../shared/models';
import { TagsService } from '../tags/tags.service';
import { ErrorService } from '../errorhandling/error.service';


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
    ]
})
export class UploaderComponent implements OnDestroy {
    private subs: Subscription[];
    public files: UploadFile[];
    public visible: boolean;
    public tags: Tag[];
    public total: number;

    constructor(
        private service: UploaderService,
        private tagsservice: TagsService,
        private errors: ErrorService
    ) {
        this.subs = [];
        let sub = this.service.requested.subscribe(show => {
            if (show && !this.visible) {
                this.tags = [];
                this.total = 0;
            }
            this.visible = show;
        }, error => this.errors.handleError(error));
        this.subs.push(sub);

        sub = this.service.fileList.subscribe(files => this.files = files, error => this.errors.handleError(error));
        this.subs.push(sub);

        this.files = [];
        this.tags = [];
        this.total = 0;
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    toggle() {
        this.files = [];
        this.tags = [];
        this.total = 0;
        this.service.clearFiles();
        this.visible = !this.visible;
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
                this.visible = false;
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
    @HostListener('window:dragenter', ['$event'])
    dragEnter(event: DragEvent) {
        let types = Array.from(event.dataTransfer.types);
        if (types.indexOf('text/html') === -1) {
            this.service.show();
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
                    this.service.addFiles(files, true);
                    this.service.show();
                });
                reader.readAsDataURL(file);
                return found = true;
            }
        });
    }
    canUpload() {
        return this.files.length > 0 && this.tags.length > 0 && this.files.filter(f => f.name.length === 0).length === 0;
    }
}
