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
                <h4>Merge Tags</h4>
                <div class="row">
                    <div class="col s6">
                        <ul class="collection">
                            <li class="collection-item" *ngFor="let tag of tags" (click)="toggleSelection(tag)" [class.red-text]="tag.count == 0">
                                {{tag.name}}<span class="badge">{{tag.count}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="col s6">
                        <ul class="collection with-heder">
                            <li class="collection-header">
                                <a class="waves-effect waves-light light-green btn right" (click)="submit($event)">merge</a>
                            </li>
                            <h4>&nbsp;</h4>
                            <li *ngIf="merge.length == 0" class="collection-item">Select tags from the list on the left</li>
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
        '.modal-content div.row .col:first-child { overflow-y: auto; height: 100%; }'
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
    private merge: Tag[] = [];
    private subs: Subscription[] = [];
    private visible: string = 'hide';

    constructor(private service: TagsService) {
        this.subs.push(service.contentTags.subscribe(tags => {
            this.tags = tags;
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
}