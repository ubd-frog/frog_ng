import {Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { IItem } from '../shared/models';
import { CapitalizePipe } from '../shared/capitalize.pipe';
import { TagsService } from '../shared/tags.service';
import { SelectionService } from '../shared/selection.service';

declare var $:any;

@Component({
    selector: 'thumbnail',
    template: `
    <a href="/frog/image/{{item.guid}}" (click)="clickHandler($event)">
        <img src='{{item.thumbnail}}'  style='width: 100%;' />
    </a>
    <div class='thumbnail-details light-green-text'>
        <p>{{item.title}}</p>
        <div class="actions text-green">
            <i (click)="like()" class="tiny material-icons">thumb_up</i> <small>{{item.like_count}}</small>
            <i (click)="setFocus($event)" class="tiny material-icons">comment</i> <small>{{item.comment_count}}</small>
            <i (click)="setFocus($event)" class="tiny material-icons">info</i>
        </div>
        <small class="author" (click)="setAuthor(item.author.name)">{{item.author.name | capitalize:1}}</small>
    </div>`,
    styles: [
        'p { position: absolute; bottom: 12px; width: 100%; font-size: 18px; color: #fff; font-weight: normal; overflow: hidden; cursor: pointer; text-overflow: ellipsis; }',
        'div > i { vertical-align: middle; cursor: pointer; }',
        'div > small { vertical-align: middle; }',
        '.actions { position: absolute; right: 0; bottom: 4px; cursor: pointer; }',
        '.tiny { font-size: 1.2rem; }',
        '.author { position: absolute; left: 4px; bottom: 6px; font-size: 0.8rem; }',
    ]
})
export class WorksThumbnailComponent implements OnInit, AfterViewInit {
    @Input() item;
    private selecteditems: IItem[] = [];
    private ctrlKey: boolean;

    constructor(private element: ElementRef, private router: Router, private service: SelectionService, private works: WorksService, private tags: TagsService) {
        this.service.selection.subscribe(items => {
            this.selecteditems = items
        });
        this.service.selectionRect.subscribe(rect => {
            if (!this.item) {
                return;
            }
            let r = this.element.nativeElement.getBoundingClientRect();
            if (rect.intersects(r)) {
                this.service.selectItem(this.item);
            }
            // else {
            //     //if (!this.ctrlKey) {
            //         this.service.deselectItem(this.item);
            //     //}
            // }
        });
    }
    ngOnInit() {
        
    }
    ngAfterViewInit() {
        
    }
    clickHandler(event: MouseEvent) {
        event.preventDefault();
        if (event.shiftKey) {
            this.service.selectItem(this.item, true);
        }
        else {
            let guids = [this.item.guid];
            let index = 0;
            if (this.selecteditems.length) {
                guids = this.selecteditems.map(function(x) { return x.guid; });
                index = guids.indexOf(this.item.guid);
                if (index === -1) {
                    guids.push(this.item.guid);
                    index = guids.length - 1;
                }
            }
            index = Math.max(0, index);
            let nav = ['/v', index, guids.join(',')];
            if (guids.length === 1) {
                nav.push('+')
            }
            this.router.navigate(nav);
        }
    }
    like() {
        this.works.likeItem(this.item);
    }
    setFocus(event) {
        this.service.setDetailItem(this.item);
    }
    setAuthor(name: string) {
        let tag = this.tags.getTagByName(name);
        if (tag != null) {
            this.router.navigate(['/w/' + this.works.id + '/' + tag.id]);
        }
    }
    // clearSelection(event) {
    //     if (event.keyCode == 100 && event.ctrl) {
    //         this.service.clear();
    //     }
    // }
    // @HostListener('window:mousemove', ['$event'])
    // isCtrlDown(event: MouseEvent) {
    //     this.ctrlKey = event.ctrlKey;
    // }
}