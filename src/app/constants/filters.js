const  technologyGroups = [
    {
      "groupName": "Property Type",
      "technologies": [
        { "name": "Hotels", "id": "hotels-checkbox", "count": 0 },
        { "name": "Hostels", "id": "hostels-checkbox", "count": 0 },
        { "name": "Apartments", "id": "apartments-checkbox", "count": 0 },
        { "name": "Apartment hotels", "id": "apartment-hotels-checkbox", "count": 0 },
        { "name": "Guesthouses", "id": "guesthouses-checkbox", "count": 0 },
        { "name": "Cottages, villas, bungalows", "id": "cottages-villas-bungalows-checkbox", "count": 0 },
        { "name": "Campgrounds", "id": "campgrounds-checkbox", "count": 0 },
        { "name": "Glampings", "id": "glampings-checkbox", "count": 0 },
        { "name": "Sanatoriums", "id": "sanatoriums-checkbox", "count": 0 },
        { "name": "Resorts", "id": "resorts-checkbox", "count": 0 },
        { "name": "Boutique hotels", "id": "boutique-hotels-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Facilities and Services",
      "subGroups": [
        {
          "subGroupName": "In the hotel",
          "technologies": [
            { "name": "Free Internet", "id": "free-internet-checkbox", "count": 0 },
            { "name": "Transfer", "id": "transfer-checkbox", "count": 0 },
            { "name": "Parking", "id": "parking-checkbox", "count": 0 },
            { "name": "Swimming Pool", "id": "swimming-pool-checkbox", "count": 0 },
            { "name": "Fitness centre", "id": "fitness-centre-checkbox", "count": 0 },
            { "name": "Bar or restaurant", "id": "bar-or-restaurant-checkbox", "count": 0 },
            { "name": "Conference hall", "id": "conference-hall-checkbox", "count": 0 },
            { "name": "Spa Services", "id": "spa-services-checkbox", "count": 0 },
            { "name": "Ski slope nearby", "id": "ski-slope-nearby-checkbox", "count": 0 },
            { "name": "Beach nearby", "id": "beach-nearby-checkbox", "count": 0 },
            { "name": "Jacuzzi", "id": "jacuzzi-checkbox", "count": 0 },
            { "name": "Electric car charging", "id": "electric-car-charging-checkbox", "count": 0 }
          ]
        },
        {
          "subGroupName": "In the room",
          "technologies": [
            { "name": "Air-conditioning", "id": "air-conditioning-checkbox", "count": 0 },
            { "name": "Private Bathroom", "id": "private-bathroom-checkbox", "count": 0 },
            { "name": "Kitchen", "id": "kitchen-checkbox", "count": 0 },
            { "name": "Balcony", "id": "balcony-checkbox", "count": 0 }
          ]
        }
      ]
    },
    {
      "groupName": "Accommodation features",
      "technologies": [
        { "name": "Suitable for children", "id": "suitable-for-children-checkbox", "count": 0 },
        { "name": "For guests with disabilities", "id": "for-guests-with-disabilities-checkbox", "count": 0 },
        { "name": "Pets allowed", "id": "pets-allowed-checkbox", "count": 0 },
        { "name": "Smoking allowed", "id": "smoking-allowed-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Meals",
      "technologies": [
        { "name": "No meals included", "id": "no-meals-included-checkbox", "count": 0 },
        { "name": "Breakfast included", "id": "breakfast-included-checkbox", "count": 0 },
        { "name": "Breakfast + dinner or lunch included", "id": "breakfast-dinner-or-lunch-included-checkbox", "count": 0 },
        { "name": "Breakfast, lunch and dinner included", "id": "breakfast-lunch-and-dinner-included-checkbox", "count": 0 },
        { "name": "All-inclusive", "id": "all-inclusive-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Accommodation features",
      "technologies": [
        { "name": "Suitable for children", "id": "suitable-for-children-checkbox", "count": 0 },
        { "name": "For guests with disabilities", "id": "for-guests-with-disabilities-checkbox", "count": 0 },
        { "name": "Pets allowed", "id": "pets-allowed-checkbox", "count": 0 },
        { "name": "Smoking allowed", "id": "smoking-allowed-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Meals",
      "technologies": [
        { "name": "No meals included", "id": "no-meals-included-checkbox", "count": 0 },
        { "name": "Breakfast included", "id": "breakfast-included-checkbox", "count": 0 },
        { "name": "Breakfast + dinner or lunch included", "id": "breakfast-dinner-or-lunch-included-checkbox", "count": 0 },
        { "name": "Breakfast, lunch and dinner included", "id": "breakfast-lunch-and-dinner-included-checkbox", "count": 0 },
        { "name": "All-inclusive", "id": "all-inclusive-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Star Rating",
      "technologies": [
        { "name": "⭐️⭐️⭐️⭐️⭐️", "id": "5-stars-checkbox", "count": 0, "icon": "⭐️⭐️⭐️⭐️⭐️" },
        { "name": "⭐️⭐️⭐️⭐️", "id": "4-stars-checkbox", "count": 0, "icon": "⭐️⭐️⭐️⭐️" },
        { "name": "⭐️⭐️⭐️", "id": "3-stars-checkbox", "count": 0, "icon": "⭐️⭐️⭐️" },
        { "name": "⭐️⭐️", "id": "2-stars-checkbox", "count": 0, "icon": "⭐️⭐️" },
        { "name": "⭐️", "id": "1-star-checkbox", "count": 0, "icon": "⭐️" },
        { "name": "or without star rating", "id": "without-star-rating-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Reviews rating",
      "technologies": [
        { "name": "Super: 9+", "id": "super-9-checkbox", "count": 0 },
        { "name": "Excellent: 8+", "id": "excellent-8-checkbox", "count": 0 },
        { "name": "Very good: 7+", "id": "very-good-7-checkbox", "count": 0 },
        { "name": "Good: 6+", "id": "good-6-checkbox", "count": 0 },
        { "name": "Fairly good: 5+", "id": "fairly-good-5-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Payment and booking",
      "technologies": [
        { "name": "No card required for booking", "id": "no-card-required-checkbox", "count": 0 },
        { "name": "Free cancellation available", "id": "free-cancellation-checkbox", "count": 0 },
        { "name": "Pay now", "id": "pay-now-checkbox", "count": 0 },
        { "name": "Pay on the spot", "id": "pay-on-the-spot-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Number of rooms",
      "technologies": [
        { "name": "1 room", "id": "1-room-checkbox", "count": 0 },
        { "name": "2 rooms", "id": "2-rooms-checkbox", "count": 0 },
        { "name": "3 rooms", "id": "3-rooms-checkbox", "count": 0 },
        { "name": "4 rooms", "id": "4-rooms-checkbox", "count": 0 },
        { "name": "5 rooms", "id": "5-rooms-checkbox", "count": 0 },
        { "name": "6 rooms", "id": "6-rooms-checkbox", "count": 0 }
      ]
    },
    {
      "groupName": "Type of bed",
      "technologies": [
        { "name": "Double bed", "id": "double-bed-checkbox", "count": 0 },
        { "name": "Separate beds", "id": "separate-beds-checkbox", "count": 0 }
      ]
    }
  ];

  module.exports = technologyGroups;
