import { Component, Input, OnInit } from '@angular/core';

import { CGroup, CItem } from "../../shared/models";
import { GroupService } from "../group.service";

@Component({
    selector: 'group-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.css']
})

export class GroupListComponent implements OnInit {
    @Input() item: CGroup;

    public options;

    constructor(private service: GroupService) {
        this.options = {
            onUpdate: (event: any) => {
                let item = this.item.children[event.newIndex];
                this.service.insert(this.item, item, event.newIndex);
            }
        };
    }

    ngOnInit() { }

    remove(item: CItem) {
        let index = this.item.children.indexOf(item);
        this.item.children.splice(index, 1);
        this.service.remove(this.item, item);
    }
}
