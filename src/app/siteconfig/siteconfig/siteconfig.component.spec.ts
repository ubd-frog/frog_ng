import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteconfigComponent } from './siteconfig.component';

describe('SiteconfigComponent', () => {
  let component: SiteconfigComponent;
  let fixture: ComponentFixture<SiteconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
