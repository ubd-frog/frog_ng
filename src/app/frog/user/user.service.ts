import { Injectable } from '@angular/core';
import {Http, Request, RequestMethod, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../shared/models';


@Injectable()
export class UserService {
    private user: User;
    public results: BehaviorSubject<User>;

    constructor(private http:Http) {
        this.results = new BehaviorSubject<User>(null);
    }
    get() {
        // this.user = new User();
        // this.user.id = 3;
        // this.user.name = 'Brett Dixon';
        // this.user.email = 'theiviaxx@gmail.com';
        // this.user.username = 'theiviaxx';
        
        // this.results.next(this.user);
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