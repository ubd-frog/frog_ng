import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";

import { CGroup, CItem } from "../shared/models";
import { WorksService } from "../works/works.service";
import { ErrorService } from "../errorhandling/error.service";


@Injectable()
export class GroupService {
    private groups: CGroup[];

    constructor(
        private http: HttpClient,
        private router: Router,
        private works: WorksService,
        private errors: ErrorService
    ) {
        works.results
            .map(v => v[0].filter(i => i.guid.charAt(0) === '4'))
            .subscribe(v => {
                this.groups = v as CGroup[];
            });
    }

    getGroup(id: number) {
        let subject = new ReplaySubject<CGroup>();
        let found = false;
        for (let i=0;i<this.groups.length;++i) {
            if (this.groups[i].id === id) {
                subject.next(this.groups[i]);
                found = true;
                break;
            }
        }

        if (!found) {
            this.http.get(`/frog/piece/group/${id}/`)
                .map(this.errors.extractValue)
                .subscribe(i => subject.next(i));
        }

        return subject;
    }

    create(items: CItem[]) {
        let url = `/frog/piece/group/`;
        let options = {
            body: {
                'guids': items.map(i => i.guid),
                'gallery': this.works.id
            },
            withCredentials: true
        };

        this.http.post(url, options)
            .map(this.errors.extractValue)
            .subscribe(() => {
            this.works.get(0, false, true);
        });
    }

    append(group: CGroup, items: CItem[]) {
        let subs  = [];
        let subject = new ReplaySubject<CGroup>();
        let url = `/frog/piece/group/${group.id}/`;
        let options = {
            body: {},
            withCredentials: true
        };

        items.forEach(i => {
            options.body = {
                'action': 'append',
                'guid': i.guid
            };
            let sub = this.http.put(url, options)
                .map(this.errors.extractValue);
            subs.push(sub);
        });
        Observable.forkJoin(subs).subscribe(() => {
            this.http.get(`/frog/piece/group/${group.id}/`)
                .map(this.errors.extractValue)
                .subscribe(i => {
                this.works.remove(items, true);
                group.children = i.children;
                subject.next(i);
            });
        });

        return subject;
    }

    insert(group: CGroup, item: CItem, index: number) {
        let url = `/frog/piece/group/${group.id}/`;
        let options = {
            body: {
                'action': 'insert',
                'guid': item.guid,
                'index': index
            },
            withCredentials: true
        };

        this.http.put(url, options)
            .map(this.errors.extractValue)
            .subscribe(() => {
            this.works.remove([item], true);
        });
    }

    remove(group: CGroup, item: CItem) {
        let url = `/frog/piece/group/${group.id}/`;
        let options = {
            body: {
                'action': 'remove',
                'guid': item.guid
            },
            withCredentials: true
        };

        this.http.put(url, options)
            .map(this.errors.extractValue)
            .subscribe(() => {

        });
    }

    ungroup(group: CGroup) {
        let url = `/frog/piece/group/${group.id}/`;
        let options = {
            body: {},
            withCredentials: true
        };
        this.http.delete(url, options)
            .map(this.errors.extractValue)
            .subscribe(() => {
            if (this.works.id) {
                this.works.get(0, false, true);
            }
            this.router.navigate(['w/' + (this.works.id || 1)]);
        });
    }
}
