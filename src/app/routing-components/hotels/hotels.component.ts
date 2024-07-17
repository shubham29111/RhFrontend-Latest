import { Component, OnInit } from '@angular/core';
import { HotelService } from 'src/app/services/hotel.service';

declare var google: any;
 interface Hotel {
  name: string;
  image: string;
  userRating: number;
  reviews: number[];
  address: string;
  distance: number;
  nearby: number;
  street: string;
  amenities: { icon: string, title: string }[];
  price: number;
}


@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [
    {
      name: 'Park Central Hotel New York',
      image: 'https://cdn.worldota.net/t/640x400/content/9e/7c/9e7ca31ccdc08f8a98348efbf1148116245d9d97.jpeg',
      userRating: 8,
      reviews: [1, 1, 1, 1],
      address: '870 7th Ave, New York',
      distance: 3.8,
      nearby: 340,
      street: '57th Street',
      amenities: [
        { icon: 'fa-wifi', title: 'Free Internet' },
        { icon: 'fa-shuttle-van', title: 'Transfer' },
        { icon: 'fa-parking', title: 'Parking' },
        { icon: 'fa-dumbbell', title: 'Fitness centre' },
        { icon: 'fa-utensils', title: 'Bar or restaurant' },
        { icon: 'fa-wheelchair', title: 'For guests with disabilities' }
      ],
      price: 242
    },
    // Add more hotel objects as needed
  ];  showMap: boolean = false;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    // this.hotels = this.hotelService.getHotels();
  }

  ngAfterViewInit(): void {
    if (this.showMap) {
      this.loadMap();
    }
  }

  setView(view: string): void {
    this.showMap = view === 'map';
    if (this.showMap) {
      setTimeout(() => {
        this.loadMap();
      }, 0);
    }
  }

  loadMap(): void {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 12
    });

    this.hotels.forEach(hotel => {
      const marker = new google.maps.Marker({
        // position: hotel.coordinates,
        map: map,
        title: hotel.name
      });

      const infowindow = new google.maps.InfoWindow({
        // content: `<div><h5>${hotel.name}</h5><p>${hotel.location}</p></div>`
      });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    });
  }
}