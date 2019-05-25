import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySubscriptionComponent } from './gallery-subscription.component';

describe('GallerySubscriptionComponent', () => {
  let component: GallerySubscriptionComponent;
  let fixture: ComponentFixture<GallerySubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallerySubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
