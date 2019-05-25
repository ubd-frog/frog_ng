import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs/ReplaySubject';

declare var marmoset: any;


@Injectable()
export class MarmosetService {
    public ready: ReplaySubject<HTMLElement>;
    private viewer: any;
    private params;

    constructor() {
        this.ready = new ReplaySubject<HTMLElement>();
        this.viewer = null;
        this.params = {
            width: 1024,
            height: 768,
            autoStart: true,
            fullFrame: true
        }
    }
    load(url: string) {
        if (this.viewer !== null) {
            this.viewer.domRoot.parentNode.removeChild(this.viewer.domRoot);
        }
        this.viewer = marmoset.embed(url, this.params);
        this.viewer.domRoot.className = "";

    }
    hide() {
        if (this.viewer !== null) {
            this.viewer.domRoot.className = "hide";
        }
    }
}
