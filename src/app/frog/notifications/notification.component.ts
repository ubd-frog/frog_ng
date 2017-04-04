import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';

import { Notification } from '../shared/models';

@Component({
    selector: 'notification',
    templateUrl: './html/notification.html',
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
    @Input() item: Notification;
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
