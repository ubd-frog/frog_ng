import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { BehaviorSubject } from 'rxjs';

import { extractValue } from '../shared/common';
import {Preferences} from "../shared/models";

@Injectable()
export class PreferencesService {
    private prefs: Preferences;
    private source: Object;
    private vis: boolean;
    public preferences: BehaviorSubject<Preferences>;
    public visible: BehaviorSubject<boolean>;

    constructor(private http: Http) {
        this.prefs = new Preferences();
        this.preferences = new BehaviorSubject<Preferences>(this.prefs);
        this.visible = new BehaviorSubject<boolean>(false);
        this.http.get('/frog/pref/').map(extractValue).subscribe(prefs => {
            this.prefs = prefs;
            this.source = Object.assign({}, this.prefs);
            this.preferences.next(this.prefs);
        });
    }
    setValue(key: string, value: any) {
        this.prefs[key] = value;
        let url = '/frog/pref/';
        let options = new RequestOptions();

        options.body = {
            key: key,
            val: value
        };
        options.withCredentials = true;
        this.http.post(url, options).map(extractValue).subscribe(() => {
            this.preferences.next(this.prefs);
        });
    }
    discard() {
        this.prefs = <Preferences>Object.assign({}, this.source);
        this.preferences.next(this.prefs);
    }
    show() {
        this.vis = true;
        this.visible.next(this.vis);
    }
    hide() {
        this.vis = false;
        this.visible.next(this.vis);
    }
}
