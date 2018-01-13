import {Component, HostListener, OnInit} from '@angular/core';

import {CItem} from "./models";
import {WorksService} from "../works/works.service";
import {SelectionService} from "./selection.service";


@Component({
    selector: 'remove-dialog',
    templateUrl: './html/remove-dialog.html',
    styles: [
        '.modal-block { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #00000082; z-index: 4001; }',
        '.modal { display: block; top: 15%; }'
    ]
})
export class RemoveDialogComponent implements OnInit {
    public items: CItem[];
    public visible: boolean;

    constructor(
        private works: WorksService,
        private selectionservice: SelectionService
    ) {

    }

    ngOnInit() { }

    confirm() {
        this.works.remove(this.items);
        this.selectionservice.clear();
        this.selectionservice.clearDetailItem();
        this.hide();
    }

    show(items: CItem[]) {
        this.items = items;
        document.body.classList.add('no-overflow');
    }

    hide() {
        this.items = null;
        document.body.classList.remove('no-overflow');
    }
}
