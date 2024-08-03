import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';
import staticFilters from './static-filters';

interface FilterItem {
  type: string | null;
  category: string;
  count: string;
}

interface Technology {
  name: string;
  id: string;
  count: string;
}

interface FilterGroup {
  groupName: string;
  category: string;
  technologies?: Technology[];
  subGroups?: { subGroupName: string; technologies: Technology[] }[];
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
  region:string='';
  showMap: boolean = false;
  loading: boolean = false;
  isLoading = true;
  allImagesLoaded: boolean = false;
  filters: FilterGroup[] = staticFilters;
  loaders: number[] = Array(10).fill(0);
  currentImageIndex: number = 0;
  map: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showFilterModal: boolean = false;
  showMapModal: boolean = false;
  totalItems: number = 0;
  selectedOption: string = 'Price (high to low)';
  dropdownOpen: boolean = false;
  options: string[] = [
    'popularity',
    'Price (low to high)',
    'Price (high to low)',
    'Closest to the city center first',
    'Guests\' rating (high to low)'
  ];
  selectedFilters: { [key: string]: string[] } = {
    kind: [],
    star_rating: [],
    serp_name: [],
    payment_method: [],
    room_amenity: []
  };
  


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
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.region=params['location'];
      
    });
    this.fetchHotels();
      this.loadFilters();
      this.loadGoogleMaps();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  
  
  fetchHotels() {
    this.loading = true; 
    const queryParams = this.buildQueryParams(true);
    this.http.get<any>(`${environment.baseUrl}/hotelsV1${queryParams}`).subscribe(      (data) => {
        this.totalItems = data.response.total;
        this.hotels = this.manipulateHotelData(data.response.data);
       
        this.hotel = this.hotels.length > 0 ? this.hotels[0] : undefined;
        this.regionName = this.hotel ? this.hotel.region_name : 'No region found';
        this.preloadImages();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching hotels', error);
        this.loading = false;
      }
    );
  }
   loadFilters() {
    const queryParams = this.buildQueryParams(false);
    this.http.get<any>(`${environment.baseUrl}/hotelsV1/ptype?regionId=${this.regionId}${queryParams}`).subscribe(
      (data) => {
        this.updateFilterCounts(data.response);
      },
      (error) => {
        console.error('Error fetching filters', error);
      }
    );
  }
  buildQueryParams(includePagination: boolean): string {
    const params = new URLSearchParams();
    for (const key in this.selectedFilters) {
      if (this.selectedFilters[key].length) {
        let paramKey = key;
      if (paramKey === 'kind') {
        paramKey = 'propertyTypes';
      }
      else if(paramKey === 'room_amenity')
      {
        paramKey='inRoom';
      }
      else if(paramKey === 'serp_name')
      {
        paramKey='serpNames';
      }
      else if(paramKey==='star_rating')
      {
        paramKey='starRatings'
        const starNumbers = this.selectedFilters[key].map(star => this.convertStarSymbolsToNumbers(star));
        params.append(paramKey, JSON.stringify(starNumbers));
        continue;
      }
     
      if (this.selectedFilters[key].length) {
        params.append(paramKey, JSON.stringify(this.selectedFilters[key]));
        console.log(`${paramKey}: ${JSON.stringify(this.selectedFilters[key])}`); 
      }
      }
    }    
    if (includePagination) {
      params.append('page', this.currentPage.toString());
      params.append('limit', this.itemsPerPage.toString());
    }
    return `?${params.toString()}`;
  }
  convertStarSymbolsToNumbers(starSymbol: string): number {
    const starNumber= starSymbol.replace(/[^⭐️]/g, '').length
    return starNumber/2;
  }
  onFilterChange(category: string, value: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;
  
    if (checked) {
      this.selectedFilters[category].push(value);
    } else {
      const index = this.selectedFilters[category].indexOf(value);
      if (index > -1) {
        this.selectedFilters[category].splice(index, 1);
      }
    }
    this.fetchHotels();
    this.loadFilters();
    this.loadGoogleMaps();
  }
  

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchHotels();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.fetchHotels();
    }
  }
  

  manipulateHotelData(hotels: any[]): Hotel[] {
    return hotels.map((hotel, index) => {
      const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019';

      const images = hotel.images && hotel.images.length > 0 
        ? hotel.images.slice(0, 10).map((img: string) => img ? img.replace('{size}', '640x400') :  [placeholderImage]) 
        :  [placeholderImage];
      return {
        ...hotel,
        images: images.length > 0 ? images : [placeholderImage],
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
    this.isLoading = false;
    const promises = this.hotels.flatMap(hotel =>
      hotel.images.map(image => this.loadImage(image))
    );
    Promise.all(promises).then(() => {
      this.allImagesLoaded = true;
      
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
 
  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4F8yyFkMxb3pO1ojHx5tFp5ETb4tIuko&libraries=places';
    script.async = true;
    script.onload = () => {
      this.initMap();
    };
    document.head.appendChild(script);
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
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
    return this.amenityIcons[amenity] || 'No Amenity'; 
  }

  createFilterMap(apiResponse: FilterItem[]): Record<string, FilterItem[]> {
    const filters: Record<string, FilterItem[]> = {};
    apiResponse.forEach(item => {
      if (!filters[item.category]) {
        filters[item.category] = [];
      }
      filters[item.category].push(item);
    });
    return filters;
  }

  formatName(name: string | null): string {
    if (name === null) return '';
    if (name === '0') return '0';
    if (name.match(/^\d+$/)) return '⭐️'.repeat(Number(name));
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  updateFilterCounts(apiResponse: FilterItem[]) {
    const filterMap = this.createFilterMap(apiResponse);

    this.filters.forEach(group => {
      group.technologies?.forEach(tech => {
        const count = filterMap[group.category]?.find(item => this.formatName(item.type) === tech.name)?.count || '';
        tech.count = count === '0' ? '' : count;
      });
    });
  }
}