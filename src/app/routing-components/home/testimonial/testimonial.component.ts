import { Component } from '@angular/core';

interface Testimonial {
  image: string;
  text: string;
  name: string;
  position: string;
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
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxeFTUR0eRWALuD2nh1TvKqhUBy259t2EHyFzLmCNFCVrZIG80ylXC2LWki__jFA9JH34&usqp=CAU',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem scelerisque, tempor mauris eget, luctus dui. Mauris magna metus, nec efficitur urna.',
      name: 'Paula Wilson',
      position: 'Frequent Traveler',
      rating: 5

    },
    {
      image: 'https://dl.memuplay.com/new_market/img/com.vicman.newprofilepic.icon.2022-06-07-21-33-07.png',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Ut tristique tempus dictum. Pellentesque viverra.',
      name: 'Antonio Moreno',
      position: 'Business Traveler',
      rating: 4

    },
    {
      image: 'https://img.buzzfeed.com/buzzfeed-static/static/2022-05/11/14/asset/82ea240a9e12/sub-buzz-2936-1652280422-21.jpg?downsize=900:*&output-format=auto&output-quality=auto',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem scelerisque, tempor mauris eget, luctus dui. Mauris magna metus, nec efficitur urna.',
      name: 'Michael Holz',
      position: 'Vacationer',
      rating: 5
    },
    {
      image: 'https://img.buzzfeed.com/buzzfeed-static/static/2022-05/11/14/asset/82ea240a9e12/sub-buzz-2936-1652279997-1.jpg?downsize=900:*&output-format=auto&output-quality=auto',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Ut tristique tempus dictum. Pellentesque viverra.',
      name: 'Mary Saveley',
      position: 'Solo Traveler',
      rating: 4
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHcRhomoiP8D_ois0NBRzRmhRH53LrVSErNg&s',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem scelerisque, tempor mauris eget, luctus dui. Mauris magna metus, nec efficitur urna.',
      name: 'Martin Sommer',
      position: 'Family Vacationer',
      rating: 3
    },
    {
      image: 'https://cdn.pixabay.com/photo/2020/06/26/14/46/india-5342927_1280.jpg',
      text: 'Vestibulum quis quam ut magna consequat faucibus. Pellentesque eget mi suscipit tincidunt. Ut tristique tempus dictum. Pellentesque viverra.',
      name: 'John Williams',
      position: 'Leisure Traveler',
      rating: 5
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
