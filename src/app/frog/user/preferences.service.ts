import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { Preferences } from '../shared/models';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class PreferencesService {
    private prefs: Preferences;
    private source: Object;
    private vis: boolean;
    public preferences: BehaviorSubject<Preferences>;
    public visible: BehaviorSubject<boolean>;

    constructor(private http: HttpClient, private errors: ErrorService) {
        this.prefs = new Preferences();
        this.preferences = new BehaviorSubject<Preferences>(this.prefs);
        this.visible = new BehaviorSubject<boolean>(false);

        this.http.get('/frog/pref/')
            .map(this.errors.extractValue, this.errors)
            .subscribe(prefs => {
            this.prefs = prefs;
            this.source = Object.assign({}, this.prefs);
            this.preferences.next(this.prefs);
        }, error => this.errors.handleError(error));
    }
    setValue(key: string, value: any) {
        this.prefs[key] = value;
        let url = '/frog/pref/';
        let options = {
            body: {
                key: key,
                val: value
            },
            withCredentials: true
        };

        this.http.post(url, options)
            .map(this.errors.extractValue, this.errors)
            .subscribe(() => {
            this.preferences.next(this.prefs);
        }, error => this.errors.handleError(error));
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
