import { Component, trigger, state, style } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { ReleaseNote } from '../shared/models';
import { ReleaseNotesService } from './release-notes.service';
import { StorageService } from '../shared/storage.service';


@Component({
    selector: 'release-notes',
    templateUrl: './html/release_notes.html',
    styles: [
        'div#modal { position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.48); z-index: 4000; }',
        '.modal { display: block; top: 10%; width: 80%; }',
        '.root { font-weight: bold; }',
        '.modal-content { background-color: #fff; overflow: hidden; height: 100%; }',
        '.modal-content > div.row { height: 86%; }',
        '.modal-content div.row .col:first-child { height: 100%; }',
        '.modal-content div.row .col:first-child > div:last-child { overflow-y: auto; height: 100%; }',
        '.switch { display: inline; }',
        'span.badge { right: 64px; }',
        'a { cursor: pointer; }',
        '.tag-item { cursor: pointer; }',
        'h1 { font-size: 2rem; }',
        'small { font-weight: 900; color: #aaa; font-size: 12px; }',
        'hr { background-color: #dedede; height: 1px; border: 0; }'
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

export class ReleaseNotesComponent {
    public visible: string;
    public notes: ReleaseNote[];
    private subs: Subscription[];

    constructor(private service: ReleaseNotesService, private storage: StorageService) {
        this.visible = 'hide';
        this.subs = [];
        this.notes = [];
        let sub = this.service.notes.subscribe(notes => {
            this.notes = notes;
        });
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }

    show() {
        this.visible = 'show';
        this.storage.set('release_notes', this.notes[0].id);
    }

    close() {
        this.visible = 'hide';
        this.service.get();
    }
}
