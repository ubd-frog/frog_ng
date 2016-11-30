import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../shared/models';


@Injectable()
export class UserService {
    private user: User;
    public results: BehaviorSubject<User>;

    constructor(private http:Http, private router: Router) {
        this.results = new BehaviorSubject<User>(null);
    }
    get() {
        let url = '/frog/getuser';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options)
            .map(this.extractValue).subscribe(data => {
                this.user = <User>data.user;
                this.user.prefs = data.prefs;

                this.results.next(this.user);
            }, error => console.log('error loading items'));
    }
    extractValue(res: Response) {
        let body = res.json();
        return body.value || null;
    }
    isAuthenticated() {
        return this.http.get('/frog/getuser').map(res => {
            if (res.json().isError) {
                this.router.navigate(['/login']);
            }
            return true;
        }).catch(() => {
            this.router.navigate(['/login']);
            return Observable.of(false)
        });
    }
    login(email, first, last) {
        let url = '/frog/login';
        let options = new RequestOptions();
        
        options.body = {
            email: email,
            first_name: first,
            last_name: last
        };
        options.withCredentials = true;

        return this.http.post(url, options).map(res => res.json());
    }
    logout() {
        let url = '/frog/logout';

        return this.http.get(url).map(this.extractValue);
    }
}