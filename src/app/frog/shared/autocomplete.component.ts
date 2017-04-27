import {Component, ElementRef, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';

import { TagsService } from '../tags/tags.service';
import { Tag } from './models';
import {Subscription} from "rxjs";

@Component({
    selector: 'autocomplete',
    templateUrl: './html/autocomplete.html',
    styles: [
        '.input-field { height: 64px; }',
        '.input-field label.active { transform: translateY(0); }',
        '.input-field input[type=search]+label { left: inherit; }',
        '.autocomplete-content { position: absolute; width: 100%; }',
        '.complete-selected { background-color: #eee; }',
        '#root { position: relative; }'
    ],
    host: {
        '(document:click)': 'handleClick($event)'
    }
})
export class AutocompleteComponent {
    @Input() placeholder: string;
    @Input() icon: string = "search";
    @Input() complex: boolean = false;
    // @Input() items: string[];
    @Output() onSelect = new EventEmitter<any>();
    @ViewChild('textedit') textedit: ElementRef;

    private selectedIndex: number;
    private cache: string = '';
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
        this.cache = '';
        this.subs = [];
        this.items = [];
        let sub = this.service.tags.subscribe(tags => {
            this.items = tags.map(tag => tag.name);
        });
        this.subs.push(sub);
    }
    reset() {
        this.query = '';
        this.filteredList = [];
        this.cache = '';
    }
    down(event) {
        event.stopPropagation();
        let select = false;
        if (event.code === "ArrowDown") {
            this.selectedIndex++;
            select = true;
        }
        else if (event.code === "ArrowUp") {
            this.selectedIndex--;
            select = true;
        }
        this.query = this.textedit.nativeElement.value;

        this.selectedIndex = (this.filteredList.length + this.selectedIndex) % this.filteredList.length;
        this.selectedIndex = (isNaN(this.selectedIndex)) ? -1 : this.selectedIndex;

        if (select) {
            this.textedit.nativeElement.value = this.filteredList[this.selectedIndex];
        }
        else {
            this.filter();
        }
    }
    filter() {
        if (this.query !== '') {
            this.filteredList = this.items.filter(item => item.indexOf(this.query.toLowerCase()) > -1);
        }
        else {
            this.filteredList = [];
        }
    }
    select(event: any) {
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
