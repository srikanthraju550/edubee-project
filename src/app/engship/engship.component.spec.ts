import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngshipComponent } from './engship.component';

describe('EngshipComponent', () => {
  let component: EngshipComponent;
  let fixture: ComponentFixture<EngshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
