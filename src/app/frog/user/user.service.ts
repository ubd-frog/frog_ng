import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Result, User } from '../shared/models';
import { ErrorService } from "../errorhandling/error.service";


@Injectable()
export class UserService {
    private results: BehaviorSubject<User>;
    public user: Observable<User>;
    public users: BehaviorSubject<User[]>;

    constructor(
        private http:HttpClient,
        private router: Router,
        private errors: ErrorService
    ) {
        this.results = new BehaviorSubject<User>(null);
        this.user = this.results.filter(user => user != null);
        this.users = new BehaviorSubject<User[]>([]);
    }
    get() {
        let url = '/frog/getuser';
        let params = new HttpParams();
        params = params.append('json', '1');
        params = params.append('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        this.http.get(url, options)
            .map(this.errors.extractValue, this.errors)
            .subscribe(data => {
                if (data === null) {
                    return;
                }
                let user = <User>data.user;
                user.prefs = data.prefs;

                this.results.next(user);
            }, error => this.errors.handleError(error));
    }
    getList() {
        let url = '/frog/userlist';
        let params = new HttpParams();
        params = params.append('json', '1');
        params = params.append('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        this.http.get(url, options)
            .map(this.errors.extractValues)
            .subscribe(users => {
                this.users.next(users);
            }, error => this.errors.handleError(error));
    }
    csrf() {
        return this.http.get('/frog/csrf').map(this.errors.extractValue, this.errors);
    }
    isAuthenticated() {
        let params = new HttpParams().set('q', '1');
        let options = {
            params: params
        };

        return this.http.get('/frog/getuser', options)
            .map(res => {
            let response = res as Result;
            if (response.isError) {
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
        let options = {
            body: {
                email: email,
                password: password
            },
            withCredentials: true
        };

        return this.http.post(url, options)
            .map(this.errors.extractValue);
    }
    logout() {
        let url = '/frog/logout';

        return this.http.get(url).map(this.errors.extractValue, this.errors);
    }
}
