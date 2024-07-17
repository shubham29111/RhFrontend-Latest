import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMoredetailsComponent } from './room-moredetails.component';

describe('RoomMoredetailsComponent', () => {
  let component: RoomMoredetailsComponent;
  let fixture: ComponentFixture<RoomMoredetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomMoredetailsComponent]
    });
    fixture = TestBed.createComponent(RoomMoredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
