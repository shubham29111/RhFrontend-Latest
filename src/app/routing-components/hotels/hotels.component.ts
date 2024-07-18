import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from 'src/app/services/hotel.service';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';



@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  regionId: string = '';
  regionName: string = '';
  showMap: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.fetchHotels();
    });
  }

  fetchHotels() {
    this.http.get<any>(environment.baseUrl+`/hotels?regionId=${this.regionId}`).subscribe(
      (data) => {
        this.hotels = data.response.data.map((hotel: any) => ({
          ...hotel,
          images: hotel.HotelImages ? hotel.HotelImages.map((img: any) => img.images.replace('{size}', '640x400')) : ['default-image.jpg']
        }));
        this.regionName = this.hotels.length > 0 ? this.hotels[0].Region.name : 'No region found';
      },
      (error) => {
        console.error('Error fetching hotels', error);
      }
    );
  }

  setView(view: string) {
    this.showMap = view === 'map';
  }

  sortHotels(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const criteria = selectElement.value;

    switch (criteria) {
      case 'price':
        this.hotels.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        this.hotels.sort((a, b) => b.userRating - a.userRating);
        break;
      case 'popularity':
      default:
        this.hotels.sort((a, b) => b.reviews - a.reviews);
        break;
    }
  }

  filterByPrice(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const price = Number(inputElement.value);

    this.hotels = this.hotels.filter(hotel => hotel.price <= price);
  }
}