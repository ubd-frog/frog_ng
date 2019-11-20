import { Component, OnDestroy, HostListener, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UploaderService } from '../uploader.service';
import { UploadFile } from '../models';
import { Tag } from '../../shared/models';
import { GroupService } from '../../groups/group.service';
import { TagsService } from '../../tags/tags.service';
import { ErrorService } from '../../errorhandling/error.service';


@Component({
    selector: 'uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnDestroy {
    @Input() group = true;
    @Input() append = true;

    private subs: Subscription[];
    public files: UploadFile[];
    public visible: boolean;
    public tags: Tag[];
    public total: number;
    public creategroup: boolean;
    public description: string;

    constructor(
        private service: UploaderService,
        private tagsservice: TagsService,
        private groupservice: GroupService,
        private errors: ErrorService
    ) {
        this.files = [];
        this.tags = [];
        this.total = 0;
        this.subs = [];
    }
    ngOnInit() {
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

        sub = this.service.uploadedFiles.subscribe(items => {
            if (this.creategroup) {
                this.groupservice.create(items);
            }
        });
        this.subs.push(sub);
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
        this.description = "";
    }
    upload() {
        if (this.files.length === 0 || this.tags.length === 0) {
            return;
        }
        this.total = this.files.length;
        if (this.creategroup) {
            this.append = false;
        }

        if (this.description) {
            this.files[0].description = this.description;
        }

        this.service.upload(this.files, this.tags, this.append).subscribe(
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
        let name = (typeof event === 'string') ? event : event.value;
        this.tagsservice.resolve(name).subscribe(tag => {
            if (tag) {
                let found = false;
                for (let t of this.tags) {
                    if (tag.id === t.id) {
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
    addTags(tags: Tag[]) {
        let ids = tags.map(t => t.id);
        this.tags = this.tags.filter(t => ids.indexOf(t.id) === -1);
        this.tags = tags.concat(this.tags);
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
        if (types.indexOf('Files') !== -1) {
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
                Observable.fromEvent(reader, 'load').subscribe(() => {
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
