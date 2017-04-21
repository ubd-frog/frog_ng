import { Component, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TagsService } from '../tags/tags.service';
import { Tag } from './models';

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
    @Output() onSelect = new EventEmitter<any>();

    private tags: Tag[];
    private selectedIndex: number;
    private cache: string = '';
    private jointags: Tag[];
    public query: string;
    public filteredList: Tag[];
    public elementRef: ElementRef;

    constructor(element: ElementRef, private service: TagsService) {
        this.tags = [];
        this.filteredList = [];
        this.query = '';
        this.selectedIndex = -1;
        this.elementRef = element;
        this.jointags = [new Tag(0, 'AND'), new Tag(0, 'OR')];

        service.tags.subscribe({
            next: (items) => {
                this.tags = items;
            }
        });
    }
    reset() {
        this.query = '';
        this.filteredList = [];
        this.cache = '';
    }
    filter() {
        if (this.query.length < this.cache.length) {
            this.cache = this.query;
        }
        if (this.query !== '' && this.query.length > this.cache.length) {
            let subquery = this.query.slice(this.cache.length).toLowerCase();
            this.filteredList = this.tags.filter(function(tag) {
                return tag.name.indexOf(subquery) > -1;
            }.bind(this));
            if (this.cache) {
                let temp = this.filteredList.splice(0);
                temp.splice(0, 0, this.jointags[0], this.jointags[1]);
                this.filteredList = temp;
                this.selectedIndex += 2;

                if (this.query.slice(this.query.length - 5).toLocaleLowerCase() == ' and ') {
                    this.activate(0);
                }
                else if (this.query.slice(this.query.length - 4).toLocaleLowerCase() == ' or ') {
                    this.activate(1);
                }
            }
        }
        else {
            this.filteredList = [];
        }
        console.log('filter', this.selectedIndex);
    }
    down(event) {
        event.stopPropagation();
        if (event.code === "ArrowDown") {
            event.preventDefault();
            this.selectedIndex++;
        }
        else if (event.code === "ArrowUp") {
            event.preventDefault();
            this.selectedIndex--;
        }
        else if (event.code === "Tab") {
            event.preventDefault();
        }
        else if (event.code === "Space") {
            this.activate(-1);
        }

        this.selectedIndex = (this.filteredList.length + this.selectedIndex) % this.filteredList.length;
        this.selectedIndex = (isNaN(this.selectedIndex)) ? -1 : this.selectedIndex;
        this.activate();
    }
    select(event: any, tag: Tag) {
        if (!tag) {
            if (this.selectedIndex === -1 || this.cache.length > 0) {
                tag = new Tag(0, this.query.trim(), false);
            }
            else {
                tag = this.filteredList[this.selectedIndex];
            }
        }
        let obj = {
            tag: tag,
            event: event
        };
        this.onSelect.emit(obj);
        this.reset();
    }
    activate(index: number=null) {
        if (this.complex) {
            index = (index != null) ? index : this.selectedIndex;
            if (index == -1) {
                if (this.cache.length == 0) {
                    this.cache = this.query;
                }
            }
            else {
                this.cache += ' ' + this.filteredList[index].name;
                this.cache = this.cache.trim() + ' ';
                this.query = this.cache;
            }
        }
        else if (this.selectedIndex !== -1) {
            this.query = this.filteredList[this.selectedIndex].name;
        }
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
