import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechArticleComponent } from './tech-article.component';

describe('TechArticleComponent', () => {
  let component: TechArticleComponent;
  let fixture: ComponentFixture<TechArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
