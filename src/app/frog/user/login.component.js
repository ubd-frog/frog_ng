System.register(['@angular/core', '@angular/router', './user.service'], function(exports_1, context_1) {
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
    var core_1, router_1, user_service_1;
    var LoginComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(service, router) {
                    this.service = service;
                    this.router = router;
                    this.email = '';
                    this.first = '';
                    this.last = '';
                    this.message = '';
                    this.csrf_token = '';
                }
                LoginComponent.prototype.ngOnInit = function () { };
                LoginComponent.prototype.clickHandler = function () {
                    var _this = this;
                    this.service.login(this.email, this.first, this.last).subscribe(function (response) {
                        _this.router.navigate(['/w/' + response]);
                    }, function (error) { return console.log("Could not log you in: " + error); });
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        template: "\n    <section class='light-green-text'>\n        <h1>Frog Login</h1>\n    </section>\n    <form method='post' action='/frog/login'>\n        {{ csrf_token }}\n        <div class='row'>\n            <div class='input-field col s12'>\n                <input type=\"email\" name='email' [(ngModel)]=\"email\">\n                <label>Email</label>\n            </div>\n        </div>\n        <div class='row'>\n            <div class='input-field col s12'>\n                <input type=\"text\" name='first' [(ngModel)]=\"first\">\n                <label>First Name</label>\n            </div>\n        </div>\n        <div class='row'>\n            <div class='input-field col s12'>\n                <input type=\"text\" name='last' [(ngModel)]=\"last\">\n                <label>Last Name</label>\n            </div>\n        </div>\n        <a class=\"waves-effect waves-light btn light-green\" (click)=\"clickHandler()\">Login</a>\n    </form>\n    <div *ngIf=\"message.length\">\n        <div class='msg alert-danger'>{{message}}</div>\n    </div>\n    <footer>\n        <a href=\"http://frog.readthedocs.io/en/latest/\" target=\"_blank\"><img src=\"/static/frog/i/frog.png\"></a>\n    </footer>\n    ",
                        styles: [
                            'body { font-family: Helvetica;background: #333;-webkit-font-smoothing: antialiased; }',
                            'form { width: 380px;margin: 4em auto;padding: 3em 2em 2em 2em;background: #666;border: 1px solid #777;box-shadow: rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px; }',
                            'footer { text-align: center; }',
                            'section { text-align:center; margin-top: 4em; }',
                        ]
                    }), 
                    __metadata('design:paramtypes', [user_service_1.UserService, router_1.Router])
                ], LoginComponent);
                return LoginComponent;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map