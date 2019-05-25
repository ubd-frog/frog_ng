import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarzipanoViewerComponent } from './marzipano-viewer.component';

describe('MarzipanoViewerComponent', () => {
  let component: MarzipanoViewerComponent;
  let fixture: ComponentFixture<MarzipanoViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarzipanoViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarzipanoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
