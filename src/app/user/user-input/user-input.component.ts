import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewInit, HostListener } from '@angular/core';

import { UserService } from '../user.service';
import { User } from '../../shared/models';
import { isUndefined } from 'util';


@Component({
    selector: 'userinput',
    templateUrl: './user-input.component.html',
    styleUrls: ['./user-input.component.css']
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
        this.service.getList();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.user) {
                this.query = this.user.name;
            }
        });
    }
    filter(event) {
        event.stopPropagation();
        if (event.code === 'ArrowDown' && this.selectedIndex < this.filteredList.length) {
            this.selectedIndex++;
        }
        else if (event.code === 'ArrowUp' && this.selectedIndex > 0) {
            this.selectedIndex--;
        }
        else {
            if (this.query !== '') {
                this.filteredList = this.users.filter(function (user) {
                    return user.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                }.bind(this));
                this.filteredList.sort();
            }
            else {
                this.filteredList = [];
            }
        }
    }
    select(event: MouseEvent, user = null) {
        if (user === null) {
            user = this.filteredList[this.selectedIndex];
        }
        if (isUndefined(user)) {
            user = new User();
            user.name = this.query;
            user.id = this.query;
        }
        else {
            this.query = user.name;
        }
        this.filteredList = [];
        this.onSelect.emit(user);
    }
    @HostListener('document:click', ['$event'])
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
