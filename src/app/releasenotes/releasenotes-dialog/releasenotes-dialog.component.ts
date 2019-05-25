import { Component } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';

import { ReleaseNote } from '../../shared/models';
import { ReleaseNotesService } from '../releasenotes.service';
import { StorageService } from '../../shared/storage.service';


@Component({
    selector: 'release-notes',
    templateUrl: './releasenotes-dialog.component.html',
    styleUrls: ['./releasenotes-dialog.component.css'],
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

export class ReleasenotesDialogComponent {
    public visible: string;
    public notes: ReleaseNote[];
    public allnotes: ReleaseNote[];
    private subs: Subscription[];

    constructor(private service: ReleaseNotesService, private storage: StorageService) {
        this.visible = 'hide';
        this.subs = [];
        this.notes = [];
        let sub = this.service.notes.subscribe(notes => {
            this.notes = notes;
        });
        this.subs.push(sub);
        sub = this.service.allnotes.subscribe(notes => this.notes = notes);
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }

    show() {
        this.visible = 'show';
        if (this.notes.length > 0) {
            this.storage.set('release_notes', this.notes[0].id);
        }
    }

    showAll() {
        this.service.getAll();
        this.visible = 'show';
    }

    close() {
        this.visible = 'hide';
        this.service.get();
    }
}
