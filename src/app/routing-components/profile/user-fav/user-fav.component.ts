import { Component } from '@angular/core';

interface Hotel {
  name: string;
  location: string;
  available: number;
  imageUrl: string;
  address: string;
  rating: number;
  stars: number;
  url: string;
}

interface HotelGroup {
  location: string;
  totalAvailable: number;
  showDetails: boolean;
  hotels: Hotel[];
}

@Component({
  selector: 'app-user-fav',
  templateUrl: './user-fav.component.html',
  styleUrls: ['./user-fav.component.css']
})
export class UserFavComponent {
  hotels: Hotel[] = [
    {
      name: 'Crowne Plaza Indianapolis-Dwtn-Union Stn',
      location: 'Indianapolis, United States of America',
      available: 2,
      imageUrl: 'https://cdn.worldota.net/t/640x400/content/01/c8/01c8d8a5ebf315c288004ae51fc3fa196f68e3aa.jpeg',
      address: '123 W Louisiana St, Indianapolis',
      rating: 8,
      stars: 3,
      url: '/rooms/crowne_plaza_indianapolis__downtown_union_station'
    },
    {
      name: 'La Quinta Inn & Suites by Wyndham Indianapolis Downtown',
      location: 'Indianapolis, United States of America',
      available: 1,
      imageUrl: 'https://cdn.worldota.net/t/640x400/content/4c/31/4c31f0e2ff005cd7afd672bb3eccd2052862dbf7.jpeg',
      address: '401 East Washington Street, Indianapolis',
      rating: 6,
      stars: 2,
      url: '/rooms/la_quinta_inn__suites_indianapolis_downtown'
    },
    {
      name: 'Hotel in Chicago',
      location: 'Chicago, United States of America',
      available: 5,
      imageUrl: 'https://example.com/chicago-hotel.jpg',
      address: '500 W Chicago St, Chicago',
      rating: 7,
      stars: 4,
      url: '/rooms/hotel_in_chicago'
    }
  ];

  groupedHotels: HotelGroup[] = [];

  constructor() {
    this.groupHotelsByLocation();
  }

  // Group hotels by their location and calculate total available rooms for each location
  groupHotelsByLocation() {
    const grouped: { [key: string]: Hotel[] } = this.hotels.reduce((acc, hotel) => {
      if (!acc[hotel.location]) {
        acc[hotel.location] = [];
      }
      acc[hotel.location].push(hotel);
      return acc;
    }, {} as { [key: string]: Hotel[] });

    this.groupedHotels = Object.keys(grouped).map(location => {
      const hotels = grouped[location];
      const totalAvailable = hotels.reduce((sum, hotel) => sum + hotel.available, 0);
      return {
        location,
        totalAvailable,
        showDetails: true, 
        hotels
      };
    });
  }

  toggleShowDetails(group: HotelGroup) {
    group.showDetails = !group.showDetails;
  }

  copyToClipboard(hotel: Hotel) {
    const hotelInfo = `Hotel: ${hotel.name}\nLocation: ${hotel.location}\nAvailable: ${hotel.available}\nRating: ${hotel.rating}\nAddress: ${hotel.address}`;
    navigator.clipboard.writeText(hotelInfo).then(() => {
      alert('Hotel information copied to clipboard!');
    });
  }
}
