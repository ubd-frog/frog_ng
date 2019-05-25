import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from "rxjs/Subscription";

import { CImage, CItem } from "../../shared/models";
import { SelectionService } from "../../shared/selection.service";

var Marzipano = require('marzipano/dist/marzipano.js');


@Component({
    selector: 'marzipano-viewer',
    templateUrl: './marzipano-viewer.component.html',
    styleUrls: ['./marzipano-viewer.component.css']
})

export class MarzipanoViewerComponent implements OnInit, OnDestroy {
    @ViewChild('pano') pano: ElementRef;

    public object: CImage;
    private scene: any;
    private viewer: any;
    private subs: Subscription[];

    constructor(private service: SelectionService) {
        this.viewer = null;
        this.scene = null;
        this.subs = [];
    }

    ngOnInit() {
        let h = {
            stageType: "webgl",
            controls: {
                mouseViewMode: "drag"
            }
        };
        this.viewer = new Marzipano.Viewer(this.pano.nativeElement, h);

        let sub = this.service.detail.distinctUntilChanged().subscribe(data => {
            let d = data.item as CImage;
            if (data.item && data.item.guid.charAt(0) === '1' && d.panoramic) {
                setTimeout(() => this.setImage(data.item), 0);
            }
        });
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        if (this.viewer) {
            this.viewer.destroy();
        }
    }

    original() {
        this.scene.switchTo();
    }

    fitToWindow() {
        this.scene.switchTo();
    }

    setImage(image: CItem) {
        if (this.scene !== null && this.viewer !== null) {
            this.viewer.destroyScene(this.scene);
        }
        this.object = <CImage>image;
        let source = Marzipano.ImageUrlSource.fromString(this.object.image);
        // let geometry = new Marzipano.CubeGeometry([{ tileSize: 512, size: 1024 }]);
        let geometry = new Marzipano.EquirectGeometry([{ width: image.width }]);

        let view = new Marzipano.RectilinearView();

        this.scene = this.viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });
        this.scene.switchTo();
    }
}
