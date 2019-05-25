import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupViewerComponent } from './group-viewer.component';

describe('GroupViewerComponent', () => {
  let component: GroupViewerComponent;
  let fixture: ComponentFixture<GroupViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
