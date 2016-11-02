System.register(['@angular/core', '@angular/common', '@angular/forms', './works/index', './shared/index', './viewer/index', './user/index'], function(exports_1, context_1) {
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
    var core_1, common_1, forms_1, index_1, index_2, index_3, index_4;
    var FrogModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (index_3_1) {
                index_3 = index_3_1;
            },
            function (index_4_1) {
                index_4 = index_4_1;
            }],
        execute: function() {
            FrogModule = (function () {
                function FrogModule() {
                }
                FrogModule = __decorate([
                    core_1.NgModule({
                        imports: [
                            common_1.CommonModule,
                            forms_1.FormsModule,
                            index_1.worksRouting,
                            index_4.userRouting,
                            index_3.viewerRouting
                        ],
                        declarations: [
                            index_1.WorksComponent,
                            index_1.WorksListComponent,
                            index_1.WorksThumbnailComponent,
                            index_1.WorksDetailComponent,
                            index_1.NavigationComponent,
                            index_1.FilterComponent,
                            index_1.SelectionComponent,
                            index_2.TagsComponent,
                            index_2.SelectionDetailComponent,
                            index_2.AutocompleteComponent,
                            index_2.CommentComponent,
                            index_2.CommentURLPipe,
                            index_2.CapitalizePipe,
                            index_2.TagArtistFilterPipe,
                            index_3.ViewerComponent,
                            index_3.ImageComponent,
                            index_3.VideoComponent,
                            index_4.LoginComponent,
                            index_4.LogoutComponent
                        ],
                        providers: [
                            index_1.WorksService,
                            index_2.TagsService,
                            index_2.SelectionService,
                            index_1.GalleryService,
                            index_4.UserService
                        ]
                    }), 
                    __metadata('design:paramtypes', [])
                ], FrogModule);
                return FrogModule;
            }());
            exports_1("FrogModule", FrogModule);
        }
    }
});
//# sourceMappingURL=frog.module.js.map