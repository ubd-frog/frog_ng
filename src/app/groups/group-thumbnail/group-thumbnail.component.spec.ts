import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupThumbnailComponent } from './group-thumbnail.component';

describe('GroupThumbnailComponent', () => {
  let component: GroupThumbnailComponent;
  let fixture: ComponentFixture<GroupThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
