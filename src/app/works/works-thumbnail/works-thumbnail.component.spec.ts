import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksThumbnailComponent } from './works-thumbnail.component';

describe('WorksThumbnailComponent', () => {
  let component: WorksThumbnailComponent;
  let fixture: ComponentFixture<WorksThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
