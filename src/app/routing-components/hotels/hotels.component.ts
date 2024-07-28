import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';
import technologyGroups from 'src/app/constants/filters'
import Swiper from 'swiper';

interface HotelImage {
  images: string;
}

declare var google: any;


@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  hotel: Hotel | undefined;
  regionId: string = '';
  regionName: string = '';
  showMap: boolean = false;
  loading: boolean = false;
  isLoading = true;
  allImagesLoaded: boolean = false;
  filters=technologyGroups;

  loaders: number[] = Array(10).fill(0);

  currentImageIndex: number = 0;
  map: any;

  showFilterModal: boolean = false;
  showMapModal: boolean = false;

  private amenityIcons: { [key: string]: string } = {
    'air_conditioning': 'fa-snowflake',
    'has_airport_transfer': 'fa-plane',
    'has_business': 'fa-briefcase',
    'has_disabled_support': 'fa-wheelchair',
    'has_fitness': 'fa-dumbbell',
    'has_internet': 'fa-wifi',
    'has_kids': 'fa-child',
    'has_meal': 'fa-utensils',
    'has_parking': 'fa-parking',
    'has_pool': 'fa-swimmer',
    'has_spa': 'fa-spa',
    'kitchen': 'fa-kitchen-set'
  };


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.fetchHotels();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  
  
  fetchHotels() {
    this.loading = true; 
    this.http.get<any>(`${environment.baseUrl}/hotelsV1?regionId=${this.regionId}&page=1`).subscribe(
      (data) => {
        this.hotels = this.manipulateHotelData(data.response.data);
        this.hotel = this.hotels.length > 0 ? this.hotels[0] : undefined;
        this.regionName = this.hotel ? this.hotel.region_name : 'No region found';
        console.log(this.hotels);
        this.preloadImages();

        
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching hotels', error);
        this.loading = false;
      }
    );
  }

  manipulateHotelData(hotels: any[]): Hotel[] {
    return hotels.map((hotel, index) => {
      const images = hotel.images && hotel.images.length > 0 ? hotel.images.map((img: string) => img.replace('{size}', '640x400')) : ['default-image.jpg']
      return {
        ...hotel,
        images: images.length > 0 ? images : ['default-image.jpg'],
        price: Math.floor(Math.random() * 10000),
        userRating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 100),
        currentImageIndex: 0,
        id: index
      };
    });
  }




  setView(view: string) {
    this.showMap = view === 'map';
  }

  isMapVisible = false;

  toggleMap() {
    this.isMapVisible = !this.isMapVisible;
    const mapOverlay = document.getElementById('mapOverlay') as HTMLDivElement;
    const hotelListing = document.getElementById('hotelListing') as HTMLDivElement;
    const toggleMapBtn = document.getElementById('toggleMapBtn') as HTMLButtonElement;
    const overlay = document.querySelector('.overlay') as HTMLElement;

    if (this.isMapVisible) {
      mapOverlay.classList.add('show');
      hotelListing.classList.add('shrink');
      toggleMapBtn.classList.add('show');
    } else {
      mapOverlay.classList.remove('show');
      hotelListing.classList.remove('shrink');
      toggleMapBtn.classList.remove('show');
    }
  }
  options: string[] = [
    'popularity',
    'Price (low to high)',
    'Price (high to low)',
    'Closest to the city center first',
    'Guests\' rating (high to low)'
  ];
  selectedOption: string = 'Price (high to low)';
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sort-by')) {
      this.dropdownOpen = false;
    }
  }

  preloadImages() {
    const promises = this.hotels.flatMap(hotel =>
      hotel.images.map(image => this.loadImage(image))
    );
    Promise.all(promises).then(() => {
      this.allImagesLoaded = true;
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  }

  nextImage(hotelId: string): void {
    const hotel = this.hotels.find(h => h.id === hotelId);
    if (hotel) {
      hotel.currentImageIndex = (hotel.currentImageIndex + 1) % hotel.images.length;
    }
  }

  prevImage(hotelId: string): void {
    const hotel = this.hotels.find(h => h.id === hotelId);
    if (hotel) {
      hotel.currentImageIndex = (hotel.currentImageIndex - 1 + hotel.images.length) % hotel.images.length;
    }
  }
 
  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: { lat: 20, lng: 0 }
    });

    if (this.hotels.length) {
      this.addMarkers();
    }
  }

  addMarkers() {
    if (this.map && this.hotels.length) {
      this.hotels.forEach(hotel => {
        const marker = new google.maps.Marker({
          position: { lat: hotel.latitude, lng: hotel.longitude },
          map: this.map,
          title: hotel.name
        });
        
        const infoWindow = new google.maps.InfoWindow({
          content: `<b>${hotel.name}</b><br>${hotel.address}`
        });

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      });
    }
  }

  formatAmenity(amenity: string): string {
    if (!amenity) return amenity;
    let formattedValue = amenity.replace(/_/g, ' ');
    return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
  }
  getAmenityIcon(amenity: string): string {
    return this.amenityIcons[amenity] || ''; 
  }
  
}
