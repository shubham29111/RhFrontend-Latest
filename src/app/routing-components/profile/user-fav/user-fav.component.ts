import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

interface Hotel {
  hotel_id: string;
  region_id: string;
  name: string;
  location: string;
  available: number;
  imageUrl: string;
  address: string;
  rating: number;
  url: string;
  stars: number;
  isLiked: boolean;  // Added field for like status
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
  userData: any; // Added userData definition

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchFavorites();
  }

  fetchFavorites() {
    this.userData = sessionStorage.getItem('user');

    if (!this.userData) {
      console.error('User not logged in.');
      return;
    }

    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.http.get<any>(`${environment.baseUrl}/favorites`, { headers }).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.mapResponseToHotels(response.response);
          this.groupHotelsByLocation();
        } else {
          console.error('Error in API response:', response.errorMessage);
        }
      },
      (error) => {
        console.error('Error fetching favorites:', error);
      }
    );
  }

  mapResponseToHotels(apiResponse: any) {
    const hotelsData: Hotel[] = [];

    apiResponse.forEach((region: any) => {
      region.hotelList.forEach((hotel: any) => {
        hotelsData.push({
          hotel_id: hotel.hotel_id,
          region_id: hotel.region_id,
          name: hotel.name,
          location: region.regionName,
          address: hotel.address,
          stars: hotel.star_rating,
          available: hotel.available || 0,
          rating: hotel.rating || 0,
          url: `/hotelrooms?hotel=${hotel.hotel_id}`,
          imageUrl: hotel.images && hotel.images.length > 0 ? hotel.images[0] : '', // Bind only the first image
          
          isLiked: hotel.isliked || true, // Set default like status
        });
      });
    });

    this.hotels = hotelsData;
  }

  getRoomImageUrl(imageUrl: string): string {
    return imageUrl.replace('{size}', '640x400');
  }

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

//   toggleLike(hotel: Hotel) {
//     const currentLikeStatus = hotel.isLiked;
//     hotel.isLiked = !currentLikeStatus;  // Toggle the like status locally
// console.log(hotel);

//     const requestBody = {
//       hotelId: hotel.hotel_id,
//     };

//     if (!this.userData) {
//       console.error('User not logged in.');
//       return;
//     }

//     const user = JSON.parse(this.userData);
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${user.token}`,
//     });

//     if (!hotel.isLiked) {
//       // Unlike the hotel
//       this.http.post(`${environment.baseUrl}/favorites/${hotel.hotel_id}`, { headers })
//         .subscribe(
//           () => {
//             this.fetchFavorites();  // Refresh the favorites list after unliking
//           },
//           error => {
//             console.error('Error updating like status:', error);
//             hotel.isLiked = currentLikeStatus;  // Revert the like status on error
//           }
//         );
//     } else {
//       // Like the hotel
//       this.http.post(`${environment.baseUrl}/favorites`, requestBody, { headers })
//         .subscribe(
//           () => {
//             this.fetchFavorites();  // Refresh the favorites list after liking
//           },
//           error => {
//             console.error('Error updating like status:', error);
//             hotel.isLiked = currentLikeStatus;  // Revert the like status on error
//           }
//         );
//     }
//   }
toggleLike(hotel: Hotel) {
  const currentLikeStatus = hotel.isLiked;
  hotel.isLiked = !currentLikeStatus;  // Toggle the like status locally

  const requestBody = {
    hotelId: hotel.hotel_id,  // Pass the hotel's ID
    regionId: Number(hotel.region_id),  // Pass the region's ID
    isLike: hotel.isLiked  // Update like status (true for like, false for unlike)
  };

  if (!this.userData) {
    console.error('User not logged in.');
    return;
  }

  const user = JSON.parse(this.userData);
  const headers = new HttpHeaders({
    Authorization: `Bearer ${user.token}`,
  });

  // Make the API request for liking/unliking the hotel
  this.http.post(`${environment.baseUrl}/favorites`, requestBody, { headers })
    .subscribe(
      () => {
        this.fetchFavorites();  // Refresh the favorites list after updating
      },
      error => {
        console.error('Error updating like status:', error);
        hotel.isLiked = currentLikeStatus;  // Revert the like status on error
      }
    );
}

}
