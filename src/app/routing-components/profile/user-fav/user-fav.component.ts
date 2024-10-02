import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

interface Hotel {
  hotel_id: string; // Add this property
  region_id: string;
  name: string;
  location: string;
  available: number;
  imageUrl: string;
  address: string;
  rating: number;
  stars: number;
  url: string;
  isLiked: boolean; // Add this field
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
export class UserFavComponent implements OnInit {
  groupedHotels: HotelGroup[] = [];
  hotels: Hotel[] = [];
  userData: any; // Will hold the user data from sessionStorage

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchFavorites();
  }

  // Fetch the user's favorite hotels from the /favorites API
  fetchFavorites() {
    this.userData = sessionStorage.getItem('user'); // Fetch user data from sessionStorage
    if (!this.userData) {
      console.error('User not logged in.');
      this.router.navigate(['/login']); // Redirect to login if no user data
      return;
    }

    const user = JSON.parse(this.userData); // Parse user data to get the token

    // Construct headers with Authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`, // Use user token from sessionStorage
    });

    // Call the /favorites API with Authorization headers
    this.http.get<any>(`${environment.baseUrl}/favorites`, { headers }).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.mapResponseToHotels(response.response);
        } else {
          console.error('Error in API response:', response.errorMessage);
        }
      },
      (error) => {
        console.error('Error fetching favorites:', error);
      }
    );
  }

  // Map the API response to the hotels data structure
  mapResponseToHotels(apiResponse: any) {
    const hotelsData: Hotel[] = [];

    apiResponse.forEach((region: any) => {
      region.hotelList.forEach((hotel: any) => {
        hotelsData.push({
          hotel_id: hotel.hotel_id,
          region_id:hotel.region_id,
          name: hotel.name,
          location: region.regionName,
          available: 1, // Assuming each liked hotel is counted as 1
          imageUrl: hotel.images[0], // Using the first image in the array
          address: hotel.address,
          rating: hotel.rating || 0, // Assuming rating could be null
          stars: hotel.star_rating,
          url: `/hotelrooms?hotel=${hotel.hotel_id}`, // Create the room URL
          isLiked: true // Since these are favorite hotels, set `isLiked` to true
        });
      });
    });

    this.hotels = hotelsData;
    this.groupHotelsByLocation(); // Group the hotels by their location
  }

  getRoomImageUrl(imageUrl: string): string {
    // Replace the {size} placeholder with '132x104'
    return imageUrl.replace('{size}', '640x400');
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

  toggleLike(hotel: Hotel) {
    // Toggle the like status locally
    const currentLikeStatus = hotel.isLiked;
    hotel.isLiked = !currentLikeStatus; // Toggle the status
  
    const requestBody = {
      hotelId: hotel.hotel_id,
      regionId: Number(hotel.region_id), // assuming regionId is available in your component
      isLike: hotel.isLiked // This will be `false` when the hotel is unliked
    };
  
    // Check if the user is logged in
    this.userData = sessionStorage.getItem('user');
   
  
    // Parse the user data to extract the token
    const user = JSON.parse(this.userData);
  
    // Define the headers with the token for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
  
    // Only send the API request if the user unlikes the hotel (isLike: false)
    if (!hotel.isLiked) {
      // Send POST request to the API when unliked
      this.http.post(`${environment.baseUrl}/favorites`, requestBody, { headers })
        .subscribe(
          response => {
            console.log('Dislike status updated successfully:', response);
          },
          error => {
            console.error('Error updating dislike status:', error);
            // Optionally revert the like status in case of an error
            hotel.isLiked = currentLikeStatus;
          }
        );
    } else {
      // Optionally, handle logic for when the hotel is liked (no API call needed)
      console.log('Hotel liked, no API call required.');
    }
  }
  
}
