import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlPagesComponent } from './html-pages.component';

describe('HtmlPagesComponent', () => {
  let component: HtmlPagesComponent;
  let fixture: ComponentFixture<HtmlPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlPagesComponent]
    });
    fixture = TestBed.createComponent(HtmlPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
