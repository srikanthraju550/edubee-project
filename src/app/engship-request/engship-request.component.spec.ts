import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngshipRequestComponent } from './engship-request.component';

describe('EngshipRequestComponent', () => {
  let component: EngshipRequestComponent;
  let fixture: ComponentFixture<EngshipRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngshipRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngshipRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
