import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environments';

import * as countries from 'i18n-iso-countries';

import enLocale from 'i18n-iso-countries/langs/en.json';

interface Place {
  id: string;
  name: string;
  countryCode: string;
  country: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-homecards',
  templateUrl: './homecards.component.html',
  styleUrls: ['./homecards.component.css']
})
export class HomecardsComponent implements OnInit {
  places: Place[] = [];
  displayedPlaces: Place[] = [];
  isLoading = false;
  placesLoaded = 0;
  totalPlaces = 0;
  checkIn!: string;
checkOut!: string;


  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) {}

  ngOnInit(): void {
    countries.registerLocale(enLocale);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(tomorrow.getDate() + 2);
    
    this.checkIn = this.formatDate(tomorrow);
    this.checkOut = this.formatDate(dayAfterTomorrow);

    this.fetchTopDestinations();
  }

  fetchTopDestinations(): void {
    this.isLoading = true;
    
    this.http.get<any>(`${environment.baseUrl}/top-destination`).subscribe(
      (response) => {
        this.isLoading = false;
        
        this.places = response.response.map((region: any) => {
          // Log the region object to the console
          console.log('Region:', region);

          const regionId = region.Region.region_id;
          const location = region.Region.name;
          const countryCode = region.Region.country_code || '';
          const image = region.Region.image || 'https://img.freepik.com/free-photo/travel-explore-global-destination-trip-adventure-concept_53876-121559.jpg'; // Fallback image if not provided

          return {
            id: region.id,
<<<<<<< HEAD
            name: location,
            countryCode: countryCode,
            image: image,
            link: `/hotels?location=${location}&type=region&regionId=${regionId}&checkIn=${this.checkIn}&checkOut=${this.checkOut}&guests=1&totalAdults=1&totalChildren=0&rooms=1`
=======
            name: region.Region.name,
            country: this.getCountryName(region.Region.countryCode), // Convert country code to full name
            imageUrl: region.image || 'https://via.placeholder.com/150', // Fallback image
            link: `/hotels?location=${location}&type=region&regionId=${regionId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=1&totalAdults=1&totalChildren=0&rooms=1`,
>>>>>>> 06bc90ff2be0d038f3d39eda59beabd6d7077602
          };
        });

        this.totalPlaces = this.places.length;
        this.loadMorePlaces();  // Load initial places
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching top destinations', error);
      }
    );
}


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCountryName(countryCode: string): string {
    return countries.getName(countryCode, 'en') || countryCode;
  }

  loadMorePlaces(): void {
    if (!this.isMoreDataAvailable()) return;

    this.isLoading = true;
    setTimeout(() => {
      const nextBatch = this.places.slice(this.placesLoaded, this.placesLoaded + 3);
      this.displayedPlaces = this.displayedPlaces.concat(nextBatch);
      this.placesLoaded += nextBatch.length;
      this.isLoading = false;
    }, 1000);
  }

  isMoreDataAvailable(): boolean {
    return this.placesLoaded < this.totalPlaces;
  }
}
