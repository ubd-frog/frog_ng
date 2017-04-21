import { Component, Output, EventEmitter, ElementRef, trigger, state, style, transition, animate } from '@angular/core';

import { GalleryService } from './gallery.service';
import { UserService } from '../user/user.service';
import { WorksService } from '../works/works.service';
import { Gallery } from '../shared/models';

declare var $:any;

@Component({
    selector: 'works-nav',
    templateUrl: './html/navigation.html',
    styles: [
        'ul { width: 360px; border: 1px solid #333; }',
        '#create_form { min-height: 0; }',
        'form { overflow: hidden; }',
        'form div { padding: 0 20px 20px 20px; border: 1px solid #558b2f; border-width: 1px 0; background-color: #333; }',
        'li.active { background-color: #2b2b2b; }',
        'li:hover { background-color: #333; }'
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
        ]),
        trigger('createState', [
            state('show', style({
                'max-height': 1000
            })),
            state('hide', style({
                'max-height': 0
            })),
            transition('show => hide', animate('100ms ease-in')),
            transition('hide => show', animate('2000ms ease-out'))
        ])
    ]
})
export class NavigationComponent {
    @Output() onSelect = new EventEmitter<Gallery>();

    public galleries: Gallery[];
    public visible: string = 'hide';
    public createVisible: string = 'hide';
    public elementRef: ElementRef;
    public title: string = '';

    constructor(
        private service: GalleryService,
        private userservice: UserService,
        private worksservice: WorksService,
        private element: ElementRef) {

        this.elementRef = element;
        service.items.subscribe(items => {
            this.galleries = items;
        });
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
        this.title = '';
        this.createVisible = 'hide';
        this.hide();
        this.onSelect.emit(gallery);
    }
    createHandler() {
        this.service.create(this.title).subscribe(gallery => {
            this.service.add(gallery);
            this.switchGallery(gallery);
        });
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
    createToggle() {
        this.createVisible = (this.createVisible == 'show') ? 'hide' : 'show';
    }
}
