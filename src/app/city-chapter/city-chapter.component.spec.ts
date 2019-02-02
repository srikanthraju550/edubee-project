import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityChapterComponent } from './city-chapter.component';

describe('CityChapterComponent', () => {
  let component: CityChapterComponent;
  let fixture: ComponentFixture<CityChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
