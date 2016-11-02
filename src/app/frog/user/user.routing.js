System.register(['@angular/router', './login.component', './logout.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, login_component_1, logout_component_1;
    var userRoutes, userRoutingProviders, userRouting;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (logout_component_1_1) {
                logout_component_1 = logout_component_1_1;
            }],
        execute: function() {
            exports_1("userRoutes", userRoutes = [
                { path: 'login', component: login_component_1.LoginComponent },
                { path: 'logout', component: logout_component_1.LogoutComponent }
            ]);
            exports_1("userRoutingProviders", userRoutingProviders = []);
            exports_1("userRouting", userRouting = router_1.RouterModule.forChild(userRoutes));
        }
    }
});
//# sourceMappingURL=user.routing.js.map