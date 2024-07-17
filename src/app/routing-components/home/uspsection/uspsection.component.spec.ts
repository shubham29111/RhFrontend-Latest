import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UspsectionComponent } from './uspsection.component';

describe('UspsectionComponent', () => {
  let component: UspsectionComponent;
  let fixture: ComponentFixture<UspsectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UspsectionComponent]
    });
    fixture = TestBed.createComponent(UspsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
