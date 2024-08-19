import { FilterGroup } from "./filter.model";

const staticFilters:FilterGroup[] = [
    {
      groupName: "Property Type",
      category: "kind",
      technologies: [
        { name: "Apartment", id: "apartment-checkbox", count: '' },
        { name: "Hotel", id: "hotel-checkbox", count: '' },
      ]
    },
    {
      groupName: "Star Rating",
      category: "star_rating",
      technologies: [
        { name: "⭐️⭐️⭐️⭐️⭐️", id: "5-stars-checkbox", count: '' },
        { name: "⭐️⭐️⭐️⭐️", id: "4-stars-checkbox", count: '' },
        { name: "⭐️⭐️⭐️", id: "3-stars-checkbox", count: '' },
        { name: "⭐️⭐️", id: "2-stars-checkbox", count: '' },
        { name: "⭐️", id: "1-star-checkbox", count: '' },
        // { name: "0", id: "0-stars-checkbox", count: '' }
      ]
    },
    {
      groupName: "Facilities and Services",
      category: "serp_name",
      technologies: [
        { name: "Has Parking", id: "has_parking-checkbox", count: '' },
        { name: "Has Meal", id: "has_meal-checkbox", count: '' },
        { name: "Has Business", id: "has_business-checkbox", count: '' },
        { name: "Has Fitness", id: "has_fitness-checkbox", count: '' },
        { name: "Kitchen", id: "kitchen-checkbox", count: '' },
        { name: "Has Kids", id: "has_kids-checkbox", count: '' },
        { name: "Has Pets", id: "has_pets-checkbox", count: '' },
        { name: "Has Smoking", id: "has_smoking-checkbox", count: '' },
        { name: "Has Pool", id: "has_pool-checkbox", count: '' },
        { name: "Has Disabled Support", id: "has_disabled_support-checkbox", count: '' },
        { name: "Has Airport Transfer", id: "has_airport_transfer-checkbox", count: '' },
        { name: "Has Spa", id: "has_spa-checkbox", count: '' },
        { name: "Has Internet", id: "has_internet-checkbox", count: '' },
        { name: "Air Conditioning", id: "air_conditioning-checkbox", count: '' },
        { name: "Beach", id: "beach-checkbox", count: '' }
      ]
    },
    {
      groupName: "Payment Method",
      category: "payment_method",
      technologies: [
        { name: "Visa", id: "visa-checkbox", count: '' },
        { name: "Master Card", id: "master_card-checkbox", count: '' },
        { name: "American Express", id: "american_express-checkbox", count: '' },
        { name: "Cash", id: "cash-checkbox", count: '' },
        { name: "Diners Club", id: "diners_club-checkbox", count: '' }
      ]
    },
    {
      groupName: "Room Amenity",
      category: "room_amenity",
      technologies: [
        { name: "Telephone", id: "telephone-checkbox", count: '' },
        { name: "Slippers", id: "slippers-checkbox", count: '' },
        { name: "Shower", id: "shower-checkbox", count: '' },
        { name: "Mosquito", id: "mosquito-checkbox", count: '' },
        { name: "Pillows", id: "pillows-checkbox", count: '' },
        { name: "Bathrobe", id: "bathrobe-checkbox", count: '' },
        { name: "Mini-Bar", id: "mini_bar-checkbox", count: '' },
        { name: "Bedsheets", id: "bedsheets-checkbox", count: '' },
        { name: "Towels", id: "towels-checkbox", count: '' },
        { name: "Safe", id: "safe-checkbox", count: '' },
        { name: "Wardrobe", id: "wardrobe-checkbox", count: '' },
        { name: "Fan", id: "fan-checkbox", count: '' },
        { name: "Duplex", id: "duplex-checkbox", count: '' },
        { name: "Wi-Fi", id: "wi_fi-checkbox", count: '' },
        { name: "Toiletries", id: "toiletries-checkbox", count: '' },
        { name: "Water", id: "water-checkbox", count: '' },
        { name: "Fridge", id: "fridge-checkbox", count: '' },
        { name: "Iron", id: "iron-checkbox", count: '' },
        { name: "Mirror", id: "mirror-checkbox", count: '' },
        { name: "Soundproofing", id: "soundproofing-checkbox", count: '' },
        { name: "Balcony", id: "balcony-checkbox", count: '' },
        { name: "Heating", id: "heating-checkbox", count: '' },
        { name: "Bath", id: "bath-checkbox", count: '' },
        { name: "Fireplace", id: "fireplace-checkbox", count: '' },
        { name: "Tea", id: "tea-checkbox", count: '' },
        { name: "Hairdryer", id: "hairdryer-checkbox", count: '' },
        { name: "Desk", id: "desk-checkbox", count: '' }
      ]
    }
  ];
  
  export default staticFilters;
  