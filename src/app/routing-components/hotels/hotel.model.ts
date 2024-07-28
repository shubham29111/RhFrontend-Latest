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
  currentImageIndex: number;
}
