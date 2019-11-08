import { Component, ElementRef, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { TagsService } from '../../tags/tags.service';
import { Tag } from '../models';
import { Subscription } from "rxjs";

@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.css'],
    host: {
        '(document:click)': 'handleClick($event)'
    }
})
export class AutocompleteComponent {
    @Input() placeholder: string;
    @Input() icon: string = "search";
    @Input() complex: boolean = false;
    @Input() artists: boolean = true;
    // @Input() items: string[];
    @Output() onSelect = new EventEmitter<any>();
    @ViewChild('textedit') textedit: ElementRef;

    private selectedIndex: number;
    private subs: Subscription[];
    public query: string;
    public filteredList: string[];
    public elementRef: ElementRef;
    public items: string[];

    constructor(element: ElementRef, private service: TagsService) {
        this.filteredList = [];
        this.query = '';
        this.selectedIndex = -1;
        this.elementRef = element;
        this.subs = [];
        this.items = [];
        let sub = this.service.tags.subscribe(tags => {
            if (this.artists) {
                this.items = tags.map(tag => tag.name);
            }
            else {
                this.items = tags.filter(tag => !tag.artist).map(tag => tag.name);
            }
        });
        this.subs.push(sub);
    }
    reset() {
        this.query = '';
        this.filteredList = [];
        this.textedit.nativeElement.value = '';
    }
    down(event: KeyboardEvent) {
        event.stopPropagation();
        if (event.type !== 'keyup') {
            return;
        }

        let select = false;
        if (event.code === "ArrowDown") {
            this.selectedIndex++;
            select = true;
        }
        else if (event.code === "ArrowUp") {
            this.selectedIndex--;
            select = true;
        }
        else {
            this.selectedIndex = -1;
        }
        this.query = this.textedit.nativeElement.value;

        if (this.selectedIndex !== -1) {
            // Keep the index in bounds
            this.selectedIndex = (this.filteredList.length + this.selectedIndex) % this.filteredList.length;
            this.selectedIndex = (isNaN(this.selectedIndex)) ? -1 : this.selectedIndex;
        }

        if (select && this.selectedIndex !== -1) {
            this.textedit.nativeElement.value = this.filteredList[this.selectedIndex];
        }
        else {
            this.filter();
        }
    }
    filter() {
        if (this.query !== '') {
            this.filteredList = this.items.filter(item => item.toLocaleLowerCase().indexOf(this.query.toLowerCase()) > -1);
        }
        else {
            this.filteredList = [];
        }
    }
    select(event: any, item: Tag = null) {
        if (this.textedit.nativeElement.value.length === 0) {
            return;
        }

        if (item !== null) {
            this.textedit.nativeElement.value = item;
        }

        let obj = {
            value: this.textedit.nativeElement.value,
            event: event
        };
        this.textedit.nativeElement.value = '';
        this.query = '';
        this.filteredList = [];
        this.onSelect.emit(obj);
    }
    handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        }
        while (clickedComponent) {
            if (!inside) {
                this.filteredList = [];
            }
        }
    }
}
