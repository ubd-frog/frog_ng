import { Component, Input, OnInit, OnDestroy, AfterContentInit, HostListener, trigger, state, style, transition, animate } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
    selector: 'panel',
    template: `
    <ul [@panelState]="visible" class="side-nav grey darken-4 grey text-lighten-1">
        
    </ul>`,
    styles: [
        'td {font-size: 12px; padding: 6px 5px;}',
        'div.name { display: block; min-height: 30px; }',
        'div.name a { line-height: 28px; font-size: 28px; padding: 0; height: inherit; }',
        'a { color: #13aff0; transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); }',
        '.artist-name-and-headline { margin-left: 0; }',
        '.headline { line-height: 20px; font-size: 14px; min-height: 20px; }',
        '.works-detail { padding: 20px 25px 20px 20px; }',
        '.works-detail > i { cursor: pointer; }',
        'h3 { font-size: 22px; margin-bottom: 10px; margin-top: 0; font-weight: 200; line-height: 1.2em; }',
        'h4 { margin-top: 0px; font-weight: 300; font-size: 18px; margin-bottom: 12.5px; line-height: 1.2em; }',
        'h5 { text-transform: uppercase; letter-spacing: 1px; margin-top: 0px; font-weight: 300; font-size: 14px; }',
        '.list-inline { padding-left: 0px; margin-left: -5px; list-style: none; }',
        '.list-inline > li { display: inline-block; padding-left: 5px; padding-right: 5px; line-height: inherit; }',
        'hr { margin-top: 25px; margin-bottom: 25px; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initia l; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-width: 1px 0px 0px; border-top: 1px solid rgb(93, 93, 93); }',
        '.separator { height: 1.8em; }',
        '.separator-sm { height: 0.9em; }',
        '.shortcuts { margin: 0; padding: 0; list-style: none; }',
        '.shortcuts > li { display: inline-block; margin-right: 10px; padding-bottom: 15px; font-size: 12px; }',
        '.label {display: inline; font-size: 75%; font-weight: bold; line-height: 1; color: rgb(255, 255, 255); text-align: center; white-space: nowrap; vertical-align: baseline; padding: 0.2em 0.6em 0.3em; border-radius: 0.25em; font-size: 13px; margin-right: 5px; }',
        '.label-default { background-color: transparent; color: rgb(116, 116, 116); border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; font-weight: normal; border-width: 1px; border-style: solid; border-color: rgb(116, 116, 116); }',
        '.tags > a { display: inline-block; line-height: inherit; position: relative; }',
        '.btn { line-height: 28px !important; height: 28px !important; padding: 0 2rem; font-size: 12px; }',
        'i { vertical-align: middle; }',
        'comment-item { display: inline-flex; width: 100%; }',
        '.editable:hover i { display: block; }',
        '.side-nav { z-index: 3010; width: 360px; }',
        '.side-nav a { font-weight: inherit; }',
        '.side-nav a.btn { margin: 0; }',
        '.side-nav li { line-height: inherit; }',
        '.row .col.s5 { padding: 0; }',
        '.file-field .btn { padding: 0 12px; }',
        '.file-field > a { margin: 0 12px 0 0; }',
        'textarea { border: none; border-left: 4px solid #4caf50; outline: none; transition: height 500ms; background-color: #1b1b1b; }',
        'textarea.expanded { height: 100px; }',
        'textarea::-webkit-input-placeholder { color: #707070; }',
        '.swatch { width: 32px; height: 32px; margin: 4px; float: left; border: 2px solid #333; cursor: pointer; }',
        '.swatch.active { border-color: #8bc34a; }'
    ],
    animations: [
        trigger('panelState', [
            state('show', style({
                transform: 'translate(0px)'
            })),
            state('hide', style({
                transform: 'translate(-360px)'
            })),
            transition('show => hide', animate('100ms ease-in')),
            transition('hide => show', animate('100ms ease-out'))
        ])
    ]
})
export class PanelComponent implements OnDestroy {
    private subs: Subscription[] = [];
    private visible: string = 'hide';

    constructor() { }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
    toggle() {
        (this.visible == 'show') ? this.hide() : this.show();
    }
}