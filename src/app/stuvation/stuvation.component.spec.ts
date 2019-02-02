import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StuvationComponent } from './stuvation.component';

describe('StuvationComponent', () => {
  let component: StuvationComponent;
  let fixture: ComponentFixture<StuvationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StuvationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StuvationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
