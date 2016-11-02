System.register(['@angular/core', '@angular/common', '@angular/router', '../shared', '../works/works.service', './image.component', './video.component'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, shared_1, works_service_1, image_component_1, video_component_1;
    var ViewerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (shared_1_1) {
                shared_1 = shared_1_1;
            },
            function (works_service_1_1) {
                works_service_1 = works_service_1_1;
            },
            function (image_component_1_1) {
                image_component_1 = image_component_1_1;
            },
            function (video_component_1_1) {
                video_component_1 = video_component_1_1;
            }],
        execute: function() {
            ViewerComponent = (function () {
                function ViewerComponent(route, router, service, selectionservice, location) {
                    var _this = this;
                    this.route = route;
                    this.router = router;
                    this.service = service;
                    this.selectionservice = selectionservice;
                    this.location = location;
                    this.objects = [];
                    this.index = 0;
                    this.isimage = true;
                    this.width = 0;
                    this.height = 0;
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.service.resolved.subscribe(function (items) {
                        _this.objects = items;
                        _this.setIndex(_this.index);
                    });
                }
                ViewerComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.route.params.subscribe(function (params) {
                        _this.index = +params['focus'];
                        var guids = params['guids'].split(',');
                        _this.service.resolveGuids(guids);
                    });
                };
                ViewerComponent.prototype.ngAfterViewInit = function () {
                    $('#viewer_info').sideNav({
                        edge: 'right',
                        menuWidth: 365
                    });
                };
                ViewerComponent.prototype.next = function () {
                    var index = this.index + 1;
                    index = (index > this.objects.length - 1) ? 0 : index;
                    this.setIndex(index);
                };
                ViewerComponent.prototype.previous = function () {
                    var index = this.index - 1;
                    index = (index < 0) ? this.objects.length - 1 : index;
                    this.setIndex(index);
                };
                ViewerComponent.prototype.original = function () {
                    if (this.image) {
                        this.image.original();
                    }
                    if (this.video) {
                        this.video.original();
                    }
                };
                ViewerComponent.prototype.fitToWindow = function () {
                    if (this.image) {
                        this.image.fitToWindow();
                    }
                    if (this.video) {
                        this.video.fitToWindow();
                    }
                };
                ViewerComponent.prototype.download = function () {
                };
                ViewerComponent.prototype.close = function (event) {
                    event.preventDefault();
                    // this.router.navigate(['/w/' + (this.service.id || 1)]);
                    this.router.navigate([this.service.routecache || '/w/1']);
                };
                ViewerComponent.prototype.setIndex = function (index) {
                    this.index = index;
                    if (this.objects.length) {
                        this.isimage = this.objects[index].guid.charAt(0) == '1';
                        this.selectionservice.setDetailItem(this.objects[index]);
                    }
                };
                __decorate([
                    core_1.ViewChild(image_component_1.ImageComponent), 
                    __metadata('design:type', image_component_1.ImageComponent)
                ], ViewerComponent.prototype, "image", void 0);
                __decorate([
                    core_1.ViewChild(video_component_1.VideoComponent), 
                    __metadata('design:type', video_component_1.VideoComponent)
                ], ViewerComponent.prototype, "video", void 0);
                ViewerComponent = __decorate([
                    core_1.Component({
                        selector: 'viewer',
                        template: "\n    <ul id=\"works_detail\" class=\"side-nav grey darken-4 grey lighten-4-text\">\n        <works-detail></works-detail>\n    </ul>\n    <div class=\"actions\">\n        <a href=\"\" (click)=\"close($event)\" class=\"grey-text text-darken-4\"><i class=\"material-icons medium\">close</i></a>\n    </div>\n    <div class='row' *ngIf=\"objects.length > 0\">\n        <div class='col s1 left'>\n            <a (click)=\"previous()\"><i class=\"material-icons large\" [style.padding-top]=\"height / 2\">navigate_before</i></a>\n        </div>\n        <div class='col s1 right'>\n            <a (click)=\"next()\"><i class=\"material-icons large\" [style.padding-top]=\"height / 2\">navigate_next</i></a>\n        </div>\n        <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n            <a class=\"btn-floating btn-large light-green\">\n                <i class=\"large material-icons\">more_vert</i>\n            </a>\n            <ul>\n                <li><a id=\"viewer_info\" class=\"btn-floating blue\" data-activates=\"works_detail\"><i class=\"material-icons\">info_outline</i></a></li>\n                <li><a class=\"btn-floating blue darken-2\" (click)=\"fitToWindow()\"><i class=\"material-icons\">desktop_windows</i></a></li>\n                <li><a class=\"btn-floating blue darken-4\" (click)=\"original()\"><i class=\"material-icons\">zoom_in</i></a></li>\n            </ul>\n        </div>\n    </div>\n    <div id='viewer' class=\"noselect\">\n        <frog-image *ngIf=\"isimage\"></frog-image>\n        <frog-video *ngIf=\"!isimage\"></frog-video>\n    </div>\n    ",
                        styles: [
                            '#viewer { background: #000; position: absolute; width: 100%; height: 100%; top: 0; left: 0; cursor: move; }',
                            '.actions { position: absolute; top: 0; right: 0; z-index: 3000; }',
                            '.row { margin-bottom: 0; z-index: 3000; height: 100%; }',
                            '.row > div.col { height: 100%; }',
                            '.row a { height: 100%; opacity: 0; -webkit-transition: opacity 0.3s 0.0s; -moz-transition: opacity 0.3s 0.0s; -ms-transition: opacity 0.3s 0.0s; }',
                            '.row a:hover { height: 100%; opacity: 1; }',
                        ]
                    }), 
                    __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, works_service_1.WorksService, shared_1.SelectionService, common_1.Location])
                ], ViewerComponent);
                return ViewerComponent;
            }());
            exports_1("ViewerComponent", ViewerComponent);
        }
    }
});
//# sourceMappingURL=viewer.component.js.map