import { Component } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';
import { ReleaseNote } from '../../shared/models';
import { ReleaseNotesService } from '../release-notes.service';
import { StorageService } from '../../shared/storage.service';



@Component({
    selector: 'release-notes',
    templateUrl: './release-notes.component.html',
    styleUrls: ['./release-notes.component.css'],
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
