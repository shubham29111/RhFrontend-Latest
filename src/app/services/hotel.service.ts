import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor() { }

  getHotels() {
    return [
        {
            id: 1,
            name: 'Park Central Hotel New York',
            location: '870 7th Ave, New York',
            distance: '3.8 km from the New York center',
            price: 236,
            rating: 8,
            reviews: 8892,
            imageUrl: 'https://via.placeholder.com/400x200?text=Hotel+1',
            coordinates: { lat: 40.7648, lng: -73.9808 }
          },
          {
            id: 2,
            name: 'The Manhattan at Times Square Hotel',
            location: '790 7th Ave, New York',
            distance: '3.5 km from the New York center',
            price: 207,
            rating: 7,
            reviews: 12911,
            imageUrl: 'https://via.placeholder.com/400x200?text=Hotel+2',
            coordinates: { lat: 40.7590, lng: -73.9845 }
          }
      // Add more hotels as needed
    ];
  }
}
