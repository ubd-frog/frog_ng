import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTagsComponent } from './recent-tags.component';

describe('RecentTagsComponent', () => {
  let component: RecentTagsComponent;
  let fixture: ComponentFixture<RecentTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
