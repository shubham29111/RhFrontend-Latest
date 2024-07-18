export interface Hotel {
        id: string;
        name: string;
        address: string;
        distance: number;
        nearby: string;
        userRating: number;
        reviews: number;
        price: number;
        images: string[];
        amenities: { title: string; icon: string }[];
        Region: { name: string };
        HotelImages: { images: string }[];
      }