import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarmosetViewerComponent } from './marmoset-viewer.component';

describe('MarmosetViewerComponent', () => {
  let component: MarmosetViewerComponent;
  let fixture: ComponentFixture<MarmosetViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarmosetViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarmosetViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
