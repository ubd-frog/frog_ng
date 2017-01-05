import { Component, OnDestroy, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { BytesPipe } from './bytes.pipe';
import { UploaderService } from './uploader.service';
import { UploadFile } from './models';
import { Tag } from '../shared/models';

@Component({
    selector: 'uploader',
    template: `
    <div [@panelState]="visible" id='uploader' (drop)="drop($event)" (dragover)="false" (dragend)="false">
        <div id="modal1" class="modal open modal-fixed-footer">
            <div class="modal-content">
                <h4>Upload Files</h4>
                <div class="row">
                    Please enter at least one tag for the uploaded items
                </div>
                <div class="row">
                    <autocomplete (onSelect)="addTag($event)"></autocomplete>
                    <tag *ngFor="let tag of tags" [item]="tag.name" (onClose)="removeTag($event)"></tag>
                </div>
                <div class="progress">
                    <div class="determinate" [style.width.%]="((total - files.length) / total) * 100"></div>
                </div>
                <table class="bordered">
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Size</th>
                            <th>Created</th>
                            <th>%</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let file of files" [class.red]="!file.unique" [class.lighten-5]="!file.unique">
                            <td>{{file.name}}</td>
                            <td>{{file.size | bytes}}</td>
                            <td>{{file.created | date:"short"}}</td>
                            <td>{{file.progress}}</td>
                            <td>{{file.status}}</td>
                            <td><i class="close material-icons" (click)="removeHandler(file)">close</i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <a (click)="toggle()" class="waves-effect waves-red btn-flat">Cancel</a>
                <a (click)="upload()" class="waves-effect waves-green btn" [class.disabled]="files.length === 0 || tags.length === 0">Upload</a>
            </div>
        </div>
    </div>`,
    styles: [
        'div#uploader { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }'
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
                this.files = [];
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
    }
    upload() {
        if (this.files.length === 0 || this.tags.length === 0) {
            return;
        }
        this.total = this.files.length;
        this.service.upload(this.files, this.tags).subscribe(files => this.files = files, () => {}, () => this.visible = 'hide');
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
        event.preventDefault();
        for (let i=0;i<event.dataTransfer.files.length;i++) {
            let file = new UploadFile(event.dataTransfer.files[i]);
            this.service.isUnique(file.name).subscribe(item => {
                if (item !== true) {
                    file.unique = false;
                    file.created = new Date(item.created);
                }
                this.files.push(file);
            });
        }
    }
}