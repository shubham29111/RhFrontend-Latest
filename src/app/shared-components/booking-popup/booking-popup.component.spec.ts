import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPopupComponent } from './booking-popup.component';

describe('BookingPopupComponent', () => {
  let component: BookingPopupComponent;
  let fixture: ComponentFixture<BookingPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingPopupComponent]
    });
    fixture = TestBed.createComponent(BookingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
