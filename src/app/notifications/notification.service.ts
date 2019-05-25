import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { Notification } from '../shared/models';


@Injectable()
export class NotificationService {
    public added: Subject<Notification>;
    public removed: Subject<Notification>;

    constructor() {
        this.added = new Subject<Notification>();
        this.removed = new Subject<Notification>();
    }
    add(item: Notification) {
        this.added.next(item);
    }
    remove(item: Notification) {
        this.removed.next(item);
    }
}
