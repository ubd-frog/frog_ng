import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, OnDestroy, AfterViewChecked, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { Subscription } from 'rxjs';

import { TagsService } from './tags.service';
import { Tag } from '../shared/models';

@Component({
    selector: 'tags-list',
    template: `
    <div [@panelState]="visible" id="modal">
        <div class="modal open modal-fixed-footer">
            <div class="modal-content">
                <a class="right" (click)="close()"><i class="material-icons">close</i></a>
                <h4>Tag Management</h4>
                <div class="row">
                    <div class="col s6">
                        <div class="row">
                            <a class="waves-effect waves-light light-green btn" (click)="sortBy('name')"><i class="material-icons">sort_by_alpha</i></a>
                            <a class="waves-effect waves-light light-green btn" (click)="sortBy('count')"><i class="material-icons">sort</i></a>
                            <div class="switch">
                                <label>
                                    <input type="checkbox" [(ngModel)]="showall" (click)="toggleFilter()">
                                    <span class="lever"></span>
                                    Unused Only
                                </label>
                            </div>
                        </div>
                        <ul class="collection">
                            <li class="collection-item" *ngFor="let tag of tags; let i=index;" (click)="toggleSelection(tag)" [class.red-text]="tag.count == 0">
                                <span *ngIf="edit != i">
                                    <span (dblclick)="editTag(i)">{{tag.name}}</span>
                                    <a (click)="remove(tag)" class="secondary-content">
                                        <i class="material-icons" [class.red-text]="deleteCheck == i">close</i>
                                    </a>
                                    <span class="secondary-content badge">{{tag.count}}</span>
                                </span>
                                <input class="input-field" autofocus="autofocus" *ngIf="edit == i" type="text" [(ngModel)]="editfield" (keyup.enter)="saveEdit()" (keyup.esc)="edit = -1" (blur)="edit = -1" />
                            </li>
                        </ul>
                    </div>
                    <div class="col s6">
                        <p>Select tags from the list on the left.  The first tag will be the root where the other selected tags will get merged into.</p>
                        <a class="waves-effect waves-light light-green btn" (click)="submit($event)">merge</a>
                        <ul *ngIf="merge.length > 0" class="collection">
                            <li class="collection-item" *ngFor="let tag of merge; let i=index;">
                                <div [class.light-green-text]="i == 0" [class.root]="i == 0">
                                    {{tag.name}}
                                    <a class="secondary-content" (click)="toggleSelection(tag)"><i class="material-icons light-green-text">close</i></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a (click)="close()" class="btn-flat">Done</a>
            </div>
        </div>
    </div>
    `,
    styles: [
        'div#modal { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',
        '.root { font-weight: bold; }',
        '.modal-content { overflow: hidden; height: 100%; }',
        '.modal-content > div.row { height: 86%; }',
        '.modal-content div.row .col:first-child { overflow-y: auto; height: 100%; }',
        '.switch { display: inline; }',
        'span.badge { right: 64px; }',
        'a { cursor: pointer; }'
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
export class TagsListComponent implements OnDestroy {
    private tags: Tag[] = [];
    private _tags: Tag[] = [];
    private merge: Tag[] = [];
    private subs: Subscription[] = [];
    private visible: string = 'hide';
    private order: boolean = true;
    private showall: boolean = false;
    private edit: number = -1;
    private editfield: string = '';
    private deleteCheck: number = -1;

    constructor(private service: TagsService) {
        this.subs.push(service.contentTags.subscribe(tags => {
            this.tags = tags;
            this._tags = this.tags.slice(0);
            this.merge = [];
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    close() {
        this.visible = 'hide';
    }
    show() {
        this.visible = 'show';
    }
    toggleSelection(tag: Tag) {
        let index = this.merge.indexOf(tag);
        if (index != -1) {
            this.merge.splice(index, 1);
        }
        else {
            this.merge.push(tag);
        }
    }
    submit(event) {
        event.preventDefault();
        this.service.merge(this.merge.map(tag => { return tag.id; }));
    }
    sortBy(attr: string) {
        this.tags.sort((a, b) => {
            if (a[attr].toLowerCase() > b[attr].toLowerCase()) {
                return 1;
            }
            else if (b[attr].toLowerCase() > a[attr].toLowerCase()) {
                return -1;
            }
            return 0;
        });
        if (this.order) {
            this.tags.reverse();
        }
        
        this.order = !this.order;
        this.edit = -1;
    }
    toggleFilter() {
        this.edit = -1;
        if (this.showall) {
            this.tags = this._tags.filter(value => { return true; });
        }
        else {
            this.tags = this._tags.filter(value => { return value.count == 0; });
        }
    }
    editTag(index: number) {
        this.edit = index;
        this.editfield = this.tags[index].name;
    }
    saveEdit() {
        this.tags[this.edit].name = this.editfield;
        this.service.rename(this.tags[this.edit]).subscribe(() => {
            this.editfield = '';
            this.edit = -1;
        });
    }
    remove(tag: Tag) {
        let index = this.tags.indexOf(tag);
        if (this.deleteCheck != index) {
            this.deleteCheck = index
            return;
        }
        this.deleteCheck = -1;
        this.tags.splice(index, 1);
        this.service.remove(tag).subscribe();
    }
}