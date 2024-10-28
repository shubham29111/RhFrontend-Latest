export interface Hotel {
  id: string;
  hotel_id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  region_id: string;
  region_name: string;
  rating: number | null;
  images: string[];
  isliked: boolean; 
  currentImageIndex: number;
  serp_names?: string[];
  star_rating: number;
  km_distance: number;
  showAllAmenities: boolean;
  price: string; 
  room_type: string; 

}