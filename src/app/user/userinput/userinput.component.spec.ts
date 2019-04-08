import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinputComponent } from './userinput.component';

describe('UserinputComponent', () => {
  let component: UserinputComponent;
  let fixture: ComponentFixture<UserinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
