System.register(['@angular/core', '@angular/common', './login.component', './logout.component', './user.service', './user.routing'], function(exports_1, context_1) {
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
    var core_1, common_1, login_component_1, logout_component_1, user_service_1, user_routing_1;
    var UserModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (logout_component_1_1) {
                logout_component_1 = logout_component_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (user_routing_1_1) {
                user_routing_1 = user_routing_1_1;
            }],
        execute: function() {
            UserModule = (function () {
                function UserModule() {
                }
                UserModule = __decorate([
                    core_1.NgModule({
                        imports: [
                            common_1.CommonModule,
                            user_routing_1.userRouting
                        ],
                        exports: [],
                        declarations: [
                            login_component_1.LoginComponent,
                            logout_component_1.LogoutComponent
                        ],
                        providers: [
                            user_service_1.UserService
                        ],
                    }), 
                    __metadata('design:paramtypes', [])
                ], UserModule);
                return UserModule;
            }());
            exports_1("UserModule", UserModule);
        }
    }
});
//# sourceMappingURL=user.module.js.map