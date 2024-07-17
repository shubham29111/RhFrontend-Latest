import { Component } from '@angular/core';

interface Testimonial {
  image: string;
  text: string;
  name: string;
  position: string;
}

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent {
  testimonials: Testimonial[] = [
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Lorem ipsum dolor sit amet, consec adipiscing elit. Nam eusem scelerisque tempor, varius quam luctus dui. Mauris magna metus nec.',
      name: 'Paula Wilson',
      position: 'Media Analyst'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Utmtc tempus dictum. Pellentesque virra.',
      name: 'Antonio Moreno',
      position: 'Web Developer'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Lorem ipsum dolor sit amet, consec adipiscing elit. Nam eusem scelerisque tempor, varius quam luctus dui. Mauris magna metus nec.',
      name: 'Michael Holz',
      position: 'Seo Analyst'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Utmtc tempus dictum. Pellentesque virra.',
      name: 'Mary Saveley',
      position: 'Web Designer'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Lorem ipsum dolor sit amet, consec adipiscing elit. Nam eusem scelerisque tempor, varius quam luctus dui. Mauris magna metus nec.',
      name: 'Martin Sommer',
      position: 'UX Analyst'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Utmtc tempus dictum. Pellentesque virra.',
      name: 'John Williams',
      position: 'Web Developer'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  chunk(arr: any[], chunkSize: number): any[] {
    let R = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
}
