System.register(['@angular/core', 'rxjs/Observable', '../shared'], function(exports_1, context_1) {
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
    var core_1, Observable_1, shared_1, shared_2;
    var FVideo, VideoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (shared_1_1) {
                shared_1 = shared_1_1;
                shared_2 = shared_1_1;
            }],
        execute: function() {
            FVideo = (function () {
                function FVideo() {
                }
                return FVideo;
            }());
            VideoComponent = (function () {
                function VideoComponent(service, changeDetectionRef) {
                    this.service = service;
                    this.changeDetectionRef = changeDetectionRef;
                    this.origin = new shared_1.Point();
                    this.xform = shared_1.Matrix.Identity();
                    this.main = shared_1.Matrix.Identity();
                    this.scaleValue = 1.0;
                    this.alive = true;
                    this.isMouseDown = false;
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.object = new FVideo();
                    this.element = null;
                }
                VideoComponent.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this.element = this.vid.nativeElement;
                    var sub = Observable_1.Observable.fromEvent(this.element, 'timeupdate');
                    sub.subscribe(function (event) {
                        _this.frame = Math.floor(_this.object.framerate * _this.element.currentTime);
                    });
                    this.service.detail.subscribe(function (item) {
                        if (item) {
                            setTimeout(function () { return _this.setImage(item); }, 0);
                        }
                    });
                };
                VideoComponent.prototype.ngOnDestroy = function () {
                    this.element.pause();
                    this.alive = false;
                };
                VideoComponent.prototype.setImage = function (image) {
                    if (!this.alive) {
                        return;
                    }
                    this.object = image;
                    this.element.load();
                    this.fitToWindow();
                };
                VideoComponent.prototype.setFrame = function (frame) {
                    var delta = (frame > 0) ? 0.07 : -0.07;
                    this.element.currentTime += delta;
                };
                // -- Events
                VideoComponent.prototype.up = function () {
                    this.isMouseDown = false;
                    this.main = this.xform;
                };
                VideoComponent.prototype.down = function (event) {
                    if (event.button == 0) {
                        this.isMouseDown = true;
                        this.origin.x = event.clientX;
                        this.origin.y = event.clientY;
                        this.element.pause();
                        this.time = this.element.currentTime;
                    }
                };
                VideoComponent.prototype.move = function (event) {
                    if (this.isMouseDown) {
                        var x = event.clientX - this.origin.x;
                        this.setFrame(x);
                        this.origin.x = event.clientX;
                    }
                };
                // @HostListener('window:mousewheel', ['$event'])
                // zoom(event:MouseEvent) {
                //     let scale:number = 1.0;
                //     if (event.detail > 0) {
                //         scale += 0.05;
                //     }
                //     else {
                //         scale -= 0.05;
                //     }
                //     let x:number = event.clientX;
                //     let y:number = event.clientY;
                //     this.xform = Matrix.Identity().x(this.main);
                //     this.translate(-x, -y);
                //     this.scale(scale, scale);
                //     this.translate(x, y);
                //     this.main = this.xform;
                //     this.render();
                // }
                VideoComponent.prototype.resize = function () {
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.xform = this.main = new shared_1.Matrix([
                        [this.object.width, 0, 0],
                        [0, this.object.height, 0],
                        [0, 0, 1]
                    ]);
                    this.fitToWindow();
                };
                VideoComponent.prototype.center = function (scale) {
                    if (scale === void 0) { scale = 1.0; }
                    this.xform = new shared_1.Matrix([
                        [this.object.width, 0, 0],
                        [0, this.object.height, 0],
                        [0, 0, 1]
                    ]);
                    this.scale(scale, scale);
                    var x = this.width / 2 - this.xform.elements[0][0] / 2;
                    var y = this.height / 2 - this.xform.elements[1][1] / 2;
                    this.translate(x, y);
                    this.main = this.xform;
                };
                VideoComponent.prototype.original = function () {
                    this.center();
                };
                VideoComponent.prototype.fitToWindow = function () {
                    var size = this.xform.rect.fit(window.innerWidth, window.innerHeight);
                    var scale = size.width / this.object.width;
                    scale = (scale > 1.0) ? 1.0 : scale;
                    this.center(scale);
                    this.margin = (window.innerHeight / 2) - (this.xform.elements[1][1] / 2);
                };
                VideoComponent.prototype.translate = function (x, y) {
                    var m1 = new shared_1.Matrix([
                        [1, 0, 0],
                        [0, 1, 0],
                        [x, y, 1]
                    ]);
                    var m2 = this.xform.x(m1);
                    this.xform = m2.dup();
                };
                VideoComponent.prototype.scale = function (x, y) {
                    var m1 = new shared_1.Matrix([
                        [x, 0, 0],
                        [0, y, 0],
                        [0, 0, 1]
                    ]);
                    var m2 = this.xform.x(m1);
                    this.xform = m2.dup();
                };
                __decorate([
                    core_1.ViewChild('vid'), 
                    __metadata('design:type', core_1.ElementRef)
                ], VideoComponent.prototype, "vid", void 0);
                __decorate([
                    core_1.HostListener('window:mouseup'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], VideoComponent.prototype, "up", null);
                __decorate([
                    core_1.HostListener('window:mousedown', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [MouseEvent]), 
                    __metadata('design:returntype', void 0)
                ], VideoComponent.prototype, "down", null);
                __decorate([
                    core_1.HostListener('window:mousemove', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [MouseEvent]), 
                    __metadata('design:returntype', void 0)
                ], VideoComponent.prototype, "move", null);
                __decorate([
                    core_1.HostListener('window:resize'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], VideoComponent.prototype, "resize", null);
                VideoComponent = __decorate([
                    core_1.Component({
                        selector: 'frog-video',
                        template: "\n    <div id='video_player'>\n        <video #vid poster=\"{{object.poster}}\" controls=\"controls\" autoplay=\"autoplay\" loop=\"loop\" [style.margin-top]=\"margin\" [style.width]=\"xform.elements[0][0]\" [style.height]=\"xform.elements[1][1]\">\n            <source type='video/mp4' src=\"{{object.video}}\" />\n        </video>\n        <p class='blue-text text-darken-2'>{{frame}}</p>\n    </div>"
                    }), 
                    __metadata('design:paramtypes', [shared_2.SelectionService, core_1.ChangeDetectorRef])
                ], VideoComponent);
                return VideoComponent;
            }());
            exports_1("VideoComponent", VideoComponent);
        }
    }
});
//# sourceMappingURL=video.component.js.map