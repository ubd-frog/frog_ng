import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitemenuComponent } from './sitemenu.component';

describe('SitemenuComponent', () => {
  let component: SitemenuComponent;
  let fixture: ComponentFixture<SitemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
