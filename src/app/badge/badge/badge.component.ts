import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Badge, BadgeService} from "../badge.service";
import {SmartComponent} from "../badge-dialog/badge-dialog.component";
import {CItem, Tag} from "../../shared/models";

@Component({
    selector: 'badge',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.css']
})
export class BadgeComponent extends SmartComponent implements OnInit, OnChanges {
    @Input() tags: Tag[];
    public badge: Badge;
    private badges: Badge[];

    constructor(private badgeservice: BadgeService) {
        super();
        this.badge = null;
        this.badges = [];
    }

    ngOnInit() {
        const sub = this.badgeservice.badges.subscribe(badges => {
            this.badges = badges;
            this.checkTags();
        });
        this.subs.push(sub);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkTags();
    }

    checkTags() {
        this.badge = null;
        const tagids = this.tags.map(t => t.id);
        for (let i=0;i<this.badges.length;i++) {
            if (tagids.indexOf(this.badges[i].tag.id) !== -1) {
                this.badge = this.badges[i];
                break;
            }
        }
    }
}
