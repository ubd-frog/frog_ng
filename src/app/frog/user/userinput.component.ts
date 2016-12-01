import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';

import { UserService } from './user.service';
import { User } from '../shared/models';

@Component({
    selector: 'userinput',
    template: `
        <div id='root'>
            <div class="input-field">
                <input id="search" type="search" class="validate filter-input input autocomplete" [(ngModel)]=query (keyup)="filter($event)" (keyup.enter)="select()">
                <label for="search"><i class="material-icons">search</i></label>
                <i class="material-icons" (click)="filteredList = []">close</i>
            </div>
            <ul class='autocomplete-content dropdown-content'>
                <li *ngFor="let item of filteredList; let idx = index" [class.complete-selected]="idx == selectedIndex"><a (click)="select($event, item)">{{item.name}}</a></li>
            </ul>
        </div>`,
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
export class UserInputComponent implements OnInit, AfterViewInit {
    @Output() onSelect = new EventEmitter<any>();
    @Input() user: User;
    private users: User[];
    private selectedIndex: number;
    public query: string;
    public filteredList: User[];
    public elementRef: ElementRef;

    constructor(element: ElementRef, private service: UserService) {
        this.users = [];
        this.filteredList = [];
        this.query = '';
        this.selectedIndex = -1;
        this.elementRef = element;
        
        service.users.subscribe(users => this.users = users);
    }
    ngOnInit() {
        this.service.get();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.user) {
                this.query = this.user.name;
            }
        });
    }
    filter(event) {
        if (event.code === "ArrowDown" && this.selectedIndex < this.filteredList.length) {
            this.selectedIndex++;
        }
        else if (event.code === "ArrowUp" && this.selectedIndex > 0) {
            this.selectedIndex--;
        }
        else {
            if (this.query !== '') {
                this.filteredList = this.users.filter(function(user) {
                    return user.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                }.bind(this));
            }
            else {
                this.filteredList = [];
            }
        }
    }
    select(event: any, user: User) {
        this.query = user.name;
        this.filteredList = [];
        this.onSelect.emit(user);
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