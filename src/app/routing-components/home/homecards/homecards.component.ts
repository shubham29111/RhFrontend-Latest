import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environments';

// Import the countries library
import * as countries from 'i18n-iso-countries';

// Import locale for countries (ES6 module import)
import enLocale from 'i18n-iso-countries/langs/en.json';

interface Place {
  id: string;
  name: string;
  countryCode: string;
  country: string; // Add this to store full country name
  imageUrl: string;
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

  constructor(private http: HttpClient, private router: Router, private loadingService: LoadingService) {}

  ngOnInit(): void {
    // Register the country locale
    countries.registerLocale(enLocale);
    this.fetchTopDestinations();
  }

  // Fetch top destinations from the API
  fetchTopDestinations() {
    this.isLoading = true;
  
    this.http.get<any>(`${environment.baseUrl}/top-destination`).subscribe(
      (response) => {
        this.isLoading = false;
  
        const tomorrow = new Date();
        const dayAfterTomorrow = new Date();
      
        tomorrow.setDate(tomorrow.getDate() + 1); // Set tomorrow's date
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1); // Set day after tomorrow
      
        const checkIn = this.formatDate(tomorrow); // Format the date to 'YYYY-MM-DD'
        const checkOut = this.formatDate(dayAfterTomorrow); // Format the date to 'YYYY-MM-DD'
  
        // Map response to places array, and build dynamic URLs for the link
        this.places = response.response.map((region: any) => {
          const regionId = region.Region.region_id;
          const location = region.Region.name;
  
          return {
            id: region.id,
            name: region.Region.name,
            country: this.getCountryName(region.Region.countryCode), // Convert country code to full name
            imageUrl: region.image || 'https://via.placeholder.com/150', // Fallback image
            link: `/hotels?location=${location}&type=region&regionId=${regionId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=1&totalAdults=1&totalChildren=0&rooms=1`,
          };
        });
  
        this.totalPlaces = this.places.length;
        this.displayedPlaces = this.places.slice(0, 3); // Show only the first 3 by default
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching top destinations', error);
      }
    );
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
  }
  

  // Convert country code to full country name
  getCountryName(countryCode: string): string {
    return countries.getName(countryCode, 'en') || countryCode; 
  }

  loadMorePlaces(): void {
    this.isLoading = true;
    setTimeout(() => {
      const nextBatch = this.places.slice(this.placesLoaded, this.placesLoaded + 3);
      this.displayedPlaces = this.displayedPlaces.concat(nextBatch);
      this.placesLoaded += 3;
      this.isLoading = false;
    }, 1000);
  }

  isMoreDataAvailable(): boolean {
    return this.placesLoaded < this.totalPlaces && this.totalPlaces > 3;
  }
}
