import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';
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

  loaders: number[] = Array(10).fill(0);

  currentImageIndex: number = 0;
  map: any;

  showFilterModal: boolean = false;
  showMapModal: boolean = false;

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
  
  technologyGroups = [
    {
      "groupName": "Property Type",
      "technologies": [
        { "name": "Hotels", "id": "hotels-checkbox", "count": 667 },
        { "name": "Hostels", "id": "hostels-checkbox", "count": 1 },
        { "name": "Apartments", "id": "apartments-checkbox", "count": 0 },
        { "name": "Apartment hotels", "id": "apartment-hotels-checkbox", "count": 1 },
        { "name": "Guesthouses", "id": "guesthouses-checkbox", "count": 3 },
        { "name": "Cottages, villas, bungalows", "id": "cottages-villas-bungalows-checkbox", "count": 0 },
        { "name": "Campgrounds", "id": "campgrounds-checkbox", "count": 0 },
        { "name": "Glampings", "id": "glampings-checkbox", "count": 0 },
        { "name": "Sanatoriums", "id": "sanatoriums-checkbox", "count": 0 },
        { "name": "Resorts", "id": "resorts-checkbox", "count": 3 },
        { "name": "Boutique hotels", "id": "boutique-hotels-checkbox", "count": 1 }
      ]
    },
    {
      "groupName": "Facilities and Services",
      "subGroups": [
        {
          "subGroupName": "In the hotel",
          "technologies": [
            { "name": "Free Internet", "id": "free-internet-checkbox", "count": 669 },
            { "name": "Transfer", "id": "transfer-checkbox", "count": 86 },
            { "name": "Parking", "id": "parking-checkbox", "count": 665 },
            { "name": "Swimming Pool", "id": "swimming-pool-checkbox", "count": 427 },
            { "name": "Fitness centre", "id": "fitness-centre-checkbox", "count": 473 },
            { "name": "Bar or restaurant", "id": "bar-or-restaurant-checkbox", "count": 411 },
            { "name": "Conference hall", "id": "conference-hall-checkbox", "count": 327 },
            { "name": "Spa Services", "id": "spa-services-checkbox", "count": 136 },
            { "name": "Ski slope nearby", "id": "ski-slope-nearby-checkbox", "count": 0 },
            { "name": "Beach nearby", "id": "beach-nearby-checkbox", "count": 0 },
            { "name": "Jacuzzi", "id": "jacuzzi-checkbox", "count": 72 },
            { "name": "Electric car charging", "id": "electric-car-charging-checkbox", "count": 34 }
          ]
        },
        {
          "subGroupName": "In the room",
          "technologies": [
            { "name": "Air-conditioning", "id": "air-conditioning-checkbox", "count": 637 },
            { "name": "Private Bathroom", "id": "private-bathroom-checkbox", "count": 675 },
            { "name": "Kitchen", "id": "kitchen-checkbox", "count": 287 },
            { "name": "Balcony", "id": "balcony-checkbox", "count": 7 }
          ]
        }
      ]
    },
    {
      "groupName": "Accommodation features",
      "technologies": [
        { "name": "Suitable for children", "id": "suitable-for-children-checkbox", "count": 360 },
        { "name": "For guests with disabilities", "id": "for-guests-with-disabilities-checkbox", "count": 653 },
        { "name": "Pets allowed", "id": "pets-allowed-checkbox", "count": 357 },
        { "name": "Smoking allowed", "id": "smoking-allowed-checkbox", "count": 191 }
      ]
    },
    {
      "groupName": "Meals",
      "technologies": [
        { "name": "No meals included", "id": "no-meals-included-checkbox", "count": 305 },
        { "name": "Breakfast included", "id": "breakfast-included-checkbox", "count": 529 },
        { "name": "Breakfast + dinner or lunch included", "id": "breakfast-dinner-or-lunch-included-checkbox", "count": 0 },
        { "name": "Breakfast, lunch and dinner included", "id": "breakfast-lunch-and-dinner-included-checkbox", "count": 0 },
        { "name": "All-inclusive", "id": "all-inclusive-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Accommodation features",
      "technologies": [
        { "name": "Suitable for children", "id": "suitable-for-children-checkbox", "count": 360 },
        { "name": "For guests with disabilities", "id": "for-guests-with-disabilities-checkbox", "count": 653 },
        { "name": "Pets allowed", "id": "pets-allowed-checkbox", "count": 357 },
        { "name": "Smoking allowed", "id": "smoking-allowed-checkbox", "count": 191 }
      ]
    },
    {
      "groupName": "Meals",
      "technologies": [
        { "name": "No meals included", "id": "no-meals-included-checkbox", "count": 305 },
        { "name": "Breakfast included", "id": "breakfast-included-checkbox", "count": 529 },
        { "name": "Breakfast + dinner or lunch included", "id": "breakfast-dinner-or-lunch-included-checkbox", "count": 0 },
        { "name": "Breakfast, lunch and dinner included", "id": "breakfast-lunch-and-dinner-included-checkbox", "count": 0 },
        { "name": "All-inclusive", "id": "all-inclusive-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Star Rating",
      "technologies": [
        { "name": "⭐️⭐️⭐️⭐️⭐️", "id": "5-stars-checkbox", "count": 0, "icon": "⭐️⭐️⭐️⭐️⭐️" },
        { "name": "⭐️⭐️⭐️⭐️", "id": "4-stars-checkbox", "count": 18, "icon": "⭐️⭐️⭐️⭐️" },
        { "name": "⭐️⭐️⭐️", "id": "3-stars-checkbox", "count": 109, "icon": "⭐️⭐️⭐️" },
        { "name": "⭐️⭐️", "id": "2-stars-checkbox", "count": 534, "icon": "⭐️⭐️" },
        { "name": "⭐️", "id": "1-star-checkbox", "count": 15, "icon": "⭐️" },
        { "name": "or without star rating", "id": "without-star-rating-checkbox", "count": 15 }
      ]
    },
    {
      "groupName": "Reviews rating",
      "technologies": [
        { "name": "Super: 9+", "id": "super-9-checkbox", "count": 82 },
        { "name": "Excellent: 8+", "id": "excellent-8-checkbox", "count": 240 },
        { "name": "Very good: 7+", "id": "very-good-7-checkbox", "count": 420 },
        { "name": "Good: 6+", "id": "good-6-checkbox", "count": 540 },
        { "name": "Fairly good: 5+", "id": "fairly-good-5-checkbox", "count": 613 }
      ]
    },
    {
      "groupName": "Payment and booking",
      "technologies": [
        { "name": "No card required for booking", "id": "no-card-required-checkbox", "count": 0 },
        { "name": "Free cancellation available", "id": "free-cancellation-checkbox", "count": 52 },
        { "name": "Pay now", "id": "pay-now-checkbox", "count": 668 },
        { "name": "Pay on the spot", "id": "pay-on-the-spot-checkbox", "count": 385 }
      ]
    },
    {
      "groupName": "Number of rooms",
      "technologies": [
        { "name": "1 room", "id": "1-room-checkbox", "count": 676 },
        { "name": "2 rooms", "id": "2-rooms-checkbox", "count": 16 },
        { "name": "3 rooms", "id": "3-rooms-checkbox", "count": 0 },
        { "name": "4 rooms", "id": "4-rooms-checkbox", "count": 0 },
        { "name": "5 rooms", "id": "5-rooms-checkbox", "count": 0 },
        { "name": "6 rooms", "id": "6-rooms-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Type of bed",
      "technologies": [
        { "name": "Double bed", "id": "double-bed-checkbox", "count": 629 },
        { "name": "Separate beds", "id": "separate-beds-checkbox", "count": 192 }
      ]
    }
    
    
    
    // Add more groups here
  ];

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


  getAmenityIcon(amenity: string): string {
    const amenityIcons: { [key: string]: string } = {
      'Parking': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/parking.svg',
      'Disabled support': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/disabled-support.svg',
      'Free Wi-Fi': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/internet.svg',
      'Air conditioning': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/air-conditioning.svg',
      'Family/Kid Friendly': 'https://st.worldota.net/master/bc039fc-fb84c92/img/svg/amenitiesmulti/kids.svg',
      'Pets allowed': 'https://st.worldota.net/master/3d9b8bb-b785a65/img/svg/amenitiesmulti/pets.svg',
      'Pool': 'https://st.worldota.net/master/3d9b8bb-b785a65/img/svg/amenitiesmulti/pool.svg',
      'Fitness': 'https://st.worldota.net/master/3d9b8bb-b785a65/img/svg/amenitiesmulti/fitness.svg',
      'Meal': 'https://st.worldota.net/master/3d9b8bb-b785a65/img/svg/amenitiesmulti/meal.svg'
    };
    
    return amenityIcons[amenity] || '';
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

    // Ensure markers are added after the map is initialized
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
}
