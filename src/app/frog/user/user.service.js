System.register(['@angular/core', '@angular/http', 'rxjs/Observable', '../shared'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, Observable_1, shared_1;
    var UserService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (shared_1_1) {
                shared_1 = shared_1_1;
            }],
        execute: function() {
            UserService = (function () {
                function UserService(http) {
                    var _this = this;
                    this.http = http;
                    this.results = Observable_1.Observable.create(function (observer) {
                        _this._observer = observer;
                    });
                    this.preAuth();
                }
                UserService.prototype.preAuth = function () {
                    // let url = '/frog/login';
                    // this.http.get(url, {withCredentials: true})
                    //     .subscribe(response => {
                    //         console.log(response);
                    //     }, error => console.log('error loading items'));
                };
                UserService.prototype.get = function () {
                    this.user = new shared_1.User();
                    this.user.id = 3;
                    this.user.name = 'Brett Dixon';
                    this.user.email = 'theiviaxx@gmail.com';
                    this.user.username = 'theiviaxx';
                    this._observer.next(this.user);
                    // let url = '/frog/user/';
                    // let options = new RequestOptions();
                    // options.search = new URLSearchParams();
                    // options.search.set('json', '1');
                    // options.search.set('timestamp', new Date().getTime().toString());
                    // this.http.get(url, options)
                    //     .map(this.extractData).subscribe(items => {
                    //         this._observer.next(items);
                    //     }, error => console.log('error loading items'));
                };
                UserService.prototype.extractData = function (res) {
                    var body = res.json();
                    return body.value || null;
                };
                UserService.prototype.login = function (email, first, last) {
                    var url = '/frog/login';
                    var options = new http_1.RequestOptions();
                    options.body = {
                        email: email,
                        first_name: first,
                        last_name: last
                    };
                    options.withCredentials = true;
                    return this.http.post(url, options).map(this.extractData);
                };
                UserService.prototype.logout = function () {
                    var url = '/frog/logout';
                    return this.http.get(url).map(this.extractData);
                };
                UserService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], UserService);
                return UserService;
            }());
            exports_1("UserService", UserService);
        }
    }
});
//# sourceMappingURL=user.service.js.map