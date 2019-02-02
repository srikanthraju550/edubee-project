import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechBankComponent } from './tech-bank.component';

describe('TechBankComponent', () => {
  let component: TechBankComponent;
  let fixture: ComponentFixture<TechBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
