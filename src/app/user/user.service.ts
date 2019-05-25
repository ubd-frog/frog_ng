import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject, of } from 'rxjs';

import { Result, User, Preferences } from '../shared/models';
import { ErrorService } from '../errorhandling/error.service';


@Injectable()
export class UserService {
    private results: BehaviorSubject<User>;
    private cached: boolean;
    public user: Observable<User>;
    public users: BehaviorSubject<User[]>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private errors: ErrorService
    ) {
        this.results = new BehaviorSubject<User>(null);
        this.user = this.results.filter(user => user != null);
        this.users = new BehaviorSubject<User[]>([]);
    }
    get() {
        if (this.cached) {
            return;
        }
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
                this.cached = true;
                let user = Object.assign(new User(), data.user);
                user.prefs = Object.assign(new Preferences(), data.prefs);

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
        if (this.cached) {
            return of(true);
        }
        let params = new HttpParams();
        params = params.append('q', '1');
        params = params.append('timestamp', new Date().getTime().toString());
        let options = {
            params: params
        };

        return this.http.get('/frog/getuser', options).map(res => {
            let response = res as Result;
            if (response.isError) {
                this.router.navigate(['/login']);
            }
            return true;
        }).catch((err) => {
            this.router.navigate(['/login']);
            return of(false);
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
            .map(this.errors.extractData);
    }
    logout() {
        let url = '/frog/logout';

        return this.http.get(url).map(this.errors.extractValue, this.errors);
    }
}
