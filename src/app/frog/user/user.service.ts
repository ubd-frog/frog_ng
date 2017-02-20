import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { extractValue } from '../shared/common';
import { User } from '../shared/models';


@Injectable()
export class UserService {
    private results: BehaviorSubject<User>;
    public user: Observable<User>;
    public users: BehaviorSubject<User[]>;

    constructor(private http:Http, private router: Router) {
        this.results = new BehaviorSubject<User>(null);
        this.user = this.results.filter(user => user != null);
        this.users = new BehaviorSubject<User[]>([]);
    }
    get() {
        let url = '/frog/getuser';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options)
            .map(extractValue).subscribe(data => {
                let user = <User>data.user;
                user.prefs = data.prefs;

                this.results.next(user);
            }, error => console.log('error loading items'));
    }
    getList() {
        let url = '/frog/userlist';
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('json', '1');
        options.search.set('timestamp', new Date().getTime().toString());

        this.http.get(url, options)
            .map(res => {return res.json().values;}).subscribe(users => {
                this.users.next(users);
            }, error => console.log('error loading items'));
    }
    csrf() {
        return this.http.get('/frog/csrf').map(extractValue);
    }
    isAuthenticated() {
        let options = new RequestOptions();
        options.search = new URLSearchParams();
        options.search.set('q', '1');
        return this.http.get('/frog/getuser', options).map(res => {
            if (res.json().isError) {
                this.router.navigate(['/login']);
            }
            return true;
        }).catch(() => {
            this.router.navigate(['/login']);
            return Observable.of(false)
        });
    }
    login(email, password) {
        let url = '/frog/login';
        let options = new RequestOptions();

        options.body = {
            email: email,
            password: password
        };
        options.withCredentials = true;

        return this.http.post(url, options).map(res => res.json());
    }
    logout() {
        let url = '/frog/logout';

        return this.http.get(url).map(extractValue);
    }
}
