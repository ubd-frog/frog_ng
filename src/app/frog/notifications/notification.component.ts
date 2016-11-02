import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';

import { Notification } from '../shared/models';

@Component({
    selector: 'notification',
    template: `<div [@panelState]="visible" class="toast"><i *ngIf="item.icon" class="material-icons left">{{item.icon}}</i>{{item.text}}</div>`,
    animations: [
        trigger('panelState', [
            state('show', style({
                transform: 'translate(0, 0)'
            })),
            state('hide', style({
                transform: 'translate(0, 32px)'
            })),
            transition('show <=> hide', animate(100))
        ])
    ]
})
export class NotificationComponent {
    @Input() item;
    private visible: string = 'hide';

    constructor() {
        setTimeout(() => this.show(), 0);
    }
    show() {
        this.visible = 'show';
    }
    hide() {
        this.visible = 'hide';
    }
}