import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsSectionComponent } from './blogs-section.component';

describe('BlogsSectionComponent', () => {
  let component: BlogsSectionComponent;
  let fixture: ComponentFixture<BlogsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogsSectionComponent]
    });
    fixture = TestBed.createComponent(BlogsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
