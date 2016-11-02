import { Component, OnInit, ElementRef, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';

import { GalleryService, Gallery } from './gallery.service';
import { UserService } from '../user/user.service';

declare var $:any;

@Component({
    selector: 'works-nav',
    template: `
    <ul [@panelState]="visible" class="dropdown-content grey darken-4 lighten-4-text" [style.display]="(visible === 'show') ? 'block' : 'none'">
        <li *ngFor="let gallery of galleries">
            <a (click)="switchGallery(gallery)">
                <i class="material-icons left">{{securityIcon(gallery)}}</i>{{gallery.title}}
            </a>
        </li>
    </ul>
    `,
    styles: [
        'ul { width: 360px; }'
    ],
    host: {
        '(document:click)': 'handleClick($event)'
    },
    animations: [
        trigger('panelState', [
            state('show', style({
                opacity: 1
            })),
            state('hide', style({
                opacity: 0
            })),
            transition('show <=> hide', animate(150))
        ])
    ]
})
export class NavigationComponent implements OnInit {
    private galleries: Gallery[];
    private visible: string = 'hide';
    private elementRef: ElementRef;

    constructor(private service: GalleryService, private userservice: UserService, private router: Router, private element: ElementRef) {
        this.elementRef = element;
        service.results.subscribe(items => {
            this.galleries = items;
        });
        service.get();
    }
    ngOnInit() {
        
    }
    private securityIcon(gallery: Gallery) {
        switch(gallery.security) {
            case 0:
                return 'lock_open';
            case 1:
                return 'lock_outline';
            case 2:
                return 'person';
        }
    }
    private switchGallery(gallery: Gallery) {
        this.router.navigate(['w/' + gallery.id]);
        this.hide();
    }
    toggle() {
        this.visible = (this.visible == 'show') ? 'hide' : 'show';
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
    handleClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement.parentElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        }
        while (clickedComponent) {
            if (!inside) {
                this.hide();
            }
        }
    }
}