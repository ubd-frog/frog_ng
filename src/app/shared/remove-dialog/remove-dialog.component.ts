import { Component, HostListener, OnInit } from '@angular/core';

import { CItem } from "../models";
import { WorksService } from "../../works/works.service";
import { SelectionService } from "../selection.service";


@Component({
    selector: 'remove-dialog',
    templateUrl: './remove-dialog.component.html',
    styleUrls: ['./remove-dialog.component.css']
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
