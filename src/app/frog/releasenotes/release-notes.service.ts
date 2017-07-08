import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ReplaySubject} from "rxjs/ReplaySubject";

import {ReleaseNote} from "../shared/models";
import {extractValues} from "../shared/common";
import {StorageService} from "../shared/storage.service";


@Injectable()
export class ReleaseNotesService {
    public notes: ReplaySubject<ReleaseNote[]>;

    constructor(private http: Http, private storage: StorageService) {
        this.notes = new ReplaySubject<ReleaseNote[]>();
        this.get();
    }
    get() {
        let url = '/frog/releasenotes';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('lastid', this.storage.get('release_notes', '0;'));

        this.http.get(url, options).map(extractValues).subscribe(values => {
            this.notes.next(values);
        });
    }

}
