import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor() { }
  private hotelDetails: any;

  setHotelDetails(details: any): void {
    this.hotelDetails = details;
  }

  getHotelDetails(): any {
    return this.hotelDetails;
  }
}
