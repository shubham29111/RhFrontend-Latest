import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.fetchHotels();
    });
  }

  fetchHotels() {
    this.loading = true; 
    this.http.get<any>(`${environment.baseUrl}/hotels?regionId=${this.regionId}`).subscribe(
      (data) => {
        this.hotels = this.manipulateHotelData(data.response.data);
        this.regionName = this.hotels.length > 0 ? this.hotels[0].Region.name : 'No region found';
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching hotels', error);
        this.loading = false;
      }
    );
  }

  manipulateHotelData(hotels: any[]): Hotel[] {
    return hotels.map(hotel => {
      const distance = this.extractDistance(hotel.HotelDescriptionStructs);
      const images = hotel.HotelImages ? hotel.HotelImages.map((img: any) => img.images.replace('{size}', '640x400')) : ['default-image.jpg'];
      const amenities = this.mapAmenities(hotel.HotelAmenityGroups);

      return {
        ...hotel,
        distance,
        images,
        amenities
      };
    });
  }

  extractDistance(descriptionStructs: any[]): number {
    for (const struct of descriptionStructs) {
      if (struct.DescriptionStruct && struct.DescriptionStruct.DescriptionStructPara) {
        const description = struct.DescriptionStruct.DescriptionStructPara;
        const match = description.match(/(\d+)\s*km/);
        if (match) {
          return parseFloat(match[1]);
        }
      }
    }
    return 0; // Default value if no distance is found
  }

  mapAmenities(amenityGroups: any[]): { title: string; icon: string }[] {
    const amenityIcons: { [key: string]: string } = {
      'Parking': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/parking.svg',
      'Pets allowed': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/add-heart.svg',
      'Family/Kid Friendly': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/kids.svg',
      'Disabled support': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/disabled-support.svg',
      'Free Wi-Fi': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/internet.svg',
      'Air conditioning': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/air-conditioning.svg',
      // Add more amenities and their icons as needed
    };

    const amenities: { title: string; icon: string }[] = [];

    amenityGroups.forEach(group => {
      group.AmenityGroupAmenities.forEach((amenity: any) => {
        const amenityTitle: string = amenity.amenities;
        if (amenityIcons[amenityTitle]) {
          amenities.push({ title: amenityTitle, icon: amenityIcons[amenityTitle] });
        }
      });
    });

    return amenities;
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
