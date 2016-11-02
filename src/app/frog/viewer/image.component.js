System.register(['@angular/core', '../shared'], function(exports_1, context_1) {
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
    var core_1, shared_1, shared_2;
    var FImage, ImageComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (shared_1_1) {
                shared_1 = shared_1_1;
                shared_2 = shared_1_1;
            }],
        execute: function() {
            FImage = (function () {
                function FImage() {
                }
                return FImage;
            }());
            ImageComponent = (function () {
                function ImageComponent(canvas, img, service, changeDetectionRef) {
                    this.service = service;
                    this.changeDetectionRef = changeDetectionRef;
                    this.origin = new shared_1.Point();
                    this.xform = shared_1.Matrix.Identity();
                    this.main = shared_1.Matrix.Identity();
                    this.scaleValue = 1.0;
                    this.loading = false;
                    this.isMouseDown = false;
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.object = new FImage();
                }
                ImageComponent.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this.ctx = this.canvas.nativeElement.getContext('2d');
                    this.element = this.img.nativeElement;
                    this.clear();
                    // TODO: How to properly do this in angular2
                    this.element.onload = this.resize.bind(this);
                    this.service.detail.subscribe(function (item) {
                        if (item) {
                            setTimeout(function () { return _this.setImage(item); }, 0);
                        }
                    });
                };
                ImageComponent.prototype.setImage = function (image) {
                    this.object = image;
                    this.loading = !this.element.complete;
                };
                // -- Events
                ImageComponent.prototype.up = function () {
                    this.isMouseDown = false;
                    this.main = this.xform;
                };
                ImageComponent.prototype.down = function (event) {
                    if (event.button == 0) {
                        this.isMouseDown = true;
                        this.origin.x = event.clientX;
                        this.origin.y = event.clientY;
                    }
                };
                ImageComponent.prototype.move = function (event) {
                    if (this.isMouseDown) {
                        var x = event.clientX - this.origin.x;
                        var y = event.clientY - this.origin.y;
                        if (event.shiftKey) {
                            if (this.axis == 'x') {
                                y = 0;
                            }
                            else {
                                x = 0;
                            }
                        }
                        this.xform = shared_1.Matrix.Identity().x(this.main);
                        this.translate(x, y);
                        this.render();
                    }
                };
                ImageComponent.prototype.zoom = function (event) {
                    var scale = 1.0;
                    if (event.detail > 0) {
                        scale += 0.05;
                    }
                    else {
                        scale -= 0.05;
                    }
                    var x = event.clientX;
                    var y = event.clientY;
                    this.xform = shared_1.Matrix.Identity().x(this.main);
                    this.translate(-x, -y);
                    this.scale(scale, scale);
                    this.translate(x, y);
                    this.main = this.xform;
                    this.render();
                };
                ImageComponent.prototype.resize = function () {
                    this.loading = false;
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.xform = this.main = new shared_1.Matrix([
                        [this.object.width, 0, 0],
                        [0, this.object.height, 0],
                        [0, 0, 1]
                    ]);
                    this.fitToWindow();
                };
                ImageComponent.prototype.clear = function () {
                    this.ctx.clearRect(0, 0, this.width, this.height);
                };
                ImageComponent.prototype.render = function () {
                    this.clear();
                    this.ctx.drawImage(this.element, Math.floor(this.xform.elements[2][0]), Math.floor(this.xform.elements[2][1]), Math.floor(this.xform.elements[0][0]), Math.floor(this.xform.elements[1][1]));
                };
                ImageComponent.prototype.center = function (scale) {
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
                    this.render();
                };
                ImageComponent.prototype.original = function () {
                    this.center();
                };
                ImageComponent.prototype.fitToWindow = function () {
                    var size = this.xform.rect.fit(window.innerWidth, window.innerHeight);
                    var scale = size.width / this.object.width;
                    scale = (scale > 1.0) ? 1.0 : scale;
                    this.center(scale);
                };
                ImageComponent.prototype.translate = function (x, y) {
                    var m1 = new shared_1.Matrix([
                        [1, 0, 0],
                        [0, 1, 0],
                        [x, y, 1]
                    ]);
                    var m2 = this.xform.x(m1);
                    this.xform = m2.dup();
                };
                ImageComponent.prototype.scale = function (x, y) {
                    var m1 = new shared_1.Matrix([
                        [x, 0, 0],
                        [0, y, 0],
                        [0, 0, 1]
                    ]);
                    var m2 = this.xform.x(m1);
                    this.xform = m2.dup();
                };
                __decorate([
                    core_1.ViewChild('canvas'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ImageComponent.prototype, "canvas", void 0);
                __decorate([
                    core_1.ViewChild('img'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ImageComponent.prototype, "img", void 0);
                __decorate([
                    core_1.HostListener('window:mouseup'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], ImageComponent.prototype, "up", null);
                __decorate([
                    core_1.HostListener('window:mousedown', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [MouseEvent]), 
                    __metadata('design:returntype', void 0)
                ], ImageComponent.prototype, "down", null);
                __decorate([
                    core_1.HostListener('window:mousemove', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [MouseEvent]), 
                    __metadata('design:returntype', void 0)
                ], ImageComponent.prototype, "move", null);
                __decorate([
                    core_1.HostListener('window:mousewheel', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [MouseEvent]), 
                    __metadata('design:returntype', void 0)
                ], ImageComponent.prototype, "zoom", null);
                __decorate([
                    core_1.HostListener('window:resize'), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], ImageComponent.prototype, "resize", null);
                ImageComponent = __decorate([
                    core_1.Component({
                        selector: 'frog-image',
                        template: "\n    <div *ngIf=\"loading\" class='spinner'>\n        loading...\n        <div class=\"preloader-wrapper small active\">\n            <div class=\"spinner-layer spinner-green-only\">\n                <div class=\"circle-clipper left\">\n                    <div class=\"circle\"></div>\n                </div>\n                <div class=\"gap-patch\">\n                    <div class=\"circle\"></div>\n                </div>\n                <div class=\"circle-clipper right\">\n                    <div class=\"circle\"></div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <img #img src=\"{{object.image}}\" style='display: none;' />\n    <canvas #canvas width=\"{{width}}\" height=\"{{height}}\"></canvas>",
                        styles: [
                            '.spinner { position: fixed; background: rgba(0, 0, 0, 0.5); width: 100%; height: 100%; color: #fff; font-size: 36px; text-align: center; padding-top: 50%; z-index: 3001; }'
                        ]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.ElementRef, shared_2.SelectionService, core_1.ChangeDetectorRef])
                ], ImageComponent);
                return ImageComponent;
            }());
            exports_1("ImageComponent", ImageComponent);
        }
    }
});
//# sourceMappingURL=image.component.js.map