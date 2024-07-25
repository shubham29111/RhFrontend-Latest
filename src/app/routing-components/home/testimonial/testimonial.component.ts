import { Component } from '@angular/core';

interface Testimonial {
  image: string;
  name: string;
  position: string;
  review: string;
  rating: number;
}

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent {
  testimonials: Testimonial[] = [
    {
      image: 'https://tecdn.b-cdn.net/img/Photos/Avatars/img%20(1).jpg',
      name: 'Maria Smantha',
      review: 'The website is very user-friendly and easy to navigate. Booking was a breeze!',
      rating: 5,
      position:"Frequent Traveller"
    },
    {
      image: 'https://tecdn.b-cdn.net/img/Photos/Avatars/img%20(2).jpg',
      name: 'Lisa Cudrow',
      review: 'I found the website to be quite useful, but I encountered some bugs during the booking process.',
      rating: 4,
      position:"Frequent Traveller"
    },
    {
      image: 'https://tecdn.b-cdn.net/img/Photos/Avatars/img%20(9).jpg',
      name: 'John Smith',
      review: 'The website was slow and unresponsive at times, making it hard to complete my booking.',
      rating: 2,
      position:"Frequent Traveller"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

 chunk(arr: any[], size: number): any[] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}


}
