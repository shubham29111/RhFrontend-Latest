import { Component } from '@angular/core';

@Component({
  selector: 'app-uspsection',
  templateUrl: './uspsection.component.html',
  styleUrls: ['./uspsection.component.css']
})
export class UspsectionComponent {

  cards: any = [
    {
      id: 1,
      icon: "fa-solid fa-martini-glass-empty",
      title: "Best Prices",
      desc: "Our prices are under close control as we work with thousands of hotels and dozens of providers directly. This also means that we always have great offers for most destinations."

    },
    {
      id: 2,
      icon: "fa-regular fa-credit-card",
      title: "Hotels across the world",
      desc: "We have over 2600000 options of accommodation around the world. This includes hotels, hostels, apartments, villas, and even campgrounds. Find suitable accommodation at any time of the year."

    },
    {
      id: 3,
      icon: "fa-solid fa-utensils",
      title: "Flexible payment",
      desc: "You can choose a payment method. We accept all major credit cards for online payment as well as PayPal. You can also pay upon arrival at the hotel."

    },
    {
      id: 4,
      icon: "fa-solid fa-droplet",
      title: "24/7 Customer Care",
      desc: "Our support specialists will help you to choose a hotel and book it. If you have a problem during your trip, our specialist will be online and find a solution in no time."

    },
    {
      id: 5,
      icon: "fa-solid fa-droplet",
      title: "Reliable reviews",
      desc: "We collect and publish travelers' reviews and add the ones from TripAdvisor. This way, you get even more information about hotels."

    },
    {
      id: 6,
      icon: "fa-solid fa-droplet",
      title: "Friendly Interface",
      desc: "Our support specialists will help you to choose a hotel and book it. If you have a problem during your trip, our specialist will be online and find a solution in no time."

    },
  ]

}
