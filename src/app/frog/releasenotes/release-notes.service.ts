import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ReleaseNote } from '../shared/models';
import { StorageService } from '../shared/storage.service';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class ReleaseNotesService {
    public notes: ReplaySubject<ReleaseNote[]>;

    constructor(private http: HttpClient, private storage: StorageService, private errors: ErrorService) {
        this.notes = new ReplaySubject<ReleaseNote[]>();
        this.get();
    }
    get() {
        let url = '/frog/releasenotes';
        let params = new HttpParams().set('lastid', this.storage.get('release_notes', '0;'));
        let options = {
            params: params
        };

        this.http.get(url, options)
            .map(this.errors.extractValues)
            .subscribe(values => {
            this.notes.next(values);
        });
    }

}
