System.register(['@angular/router', './viewer.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, viewer_component_1;
    var viewerRoutes, viewerRoutingProviders, viewerRouting;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (viewer_component_1_1) {
                viewer_component_1 = viewer_component_1_1;
            }],
        execute: function() {
            exports_1("viewerRoutes", viewerRoutes = [
                { path: 'v/:focus', component: viewer_component_1.ViewerComponent },
                { path: 'v/:focus/:guids', component: viewer_component_1.ViewerComponent }
            ]);
            exports_1("viewerRoutingProviders", viewerRoutingProviders = []);
            exports_1("viewerRouting", viewerRouting = router_1.RouterModule.forChild(viewerRoutes));
        }
    }
});
//# sourceMappingURL=viewer.routing.js.map