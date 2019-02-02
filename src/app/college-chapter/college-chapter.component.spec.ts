import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeChapterComponent } from './college-chapter.component';

describe('CollegeChapterComponent', () => {
  let component: CollegeChapterComponent;
  let fixture: ComponentFixture<CollegeChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
