import { Injectable } from '@angular/core';

import { Preferences } from '../shared/models';
import { PreferencesService } from '../user/preferences.service';


@Injectable()
export class SlideshowService {
    private timer;
    private prefs: Preferences;

    constructor(private prefservice: PreferencesService) {
        this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
    }
    start(callback, timeout) {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        document.body.requestPointerLock();
        this.timer = setTimeout(() => callback(this.prefs.slideshowRandomize), timeout * 1000);
    }
    stop() {
        document.exitPointerLock();
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        this.timer = null;
    }
}
