import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMenuComponent } from './sitemenu.component';

describe('SitemenuComponent', () => {
    let component: SiteMenuComponent;
    let fixture: ComponentFixture<SiteMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SiteMenuComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
