import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksListComponent } from './works-list.component';

describe('WorksListComponent', () => {
  let component: WorksListComponent;
  let fixture: ComponentFixture<WorksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
