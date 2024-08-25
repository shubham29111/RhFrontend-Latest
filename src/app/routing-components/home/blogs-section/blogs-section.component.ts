import { Component } from '@angular/core';

interface BlogPost {
  link: string;
  imageSrc: string;
  category: string;
  date: string;
  title: string;
}

@Component({
  selector: 'app-blogs-section',
  templateUrl: './blogs-section.component.html',
  styleUrls: ['./blogs-section.component.css']
})
export class BlogsSectionComponent {
  posts: BlogPost[] = [
    {
      link: '/blog/12',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
      category: 'Travel Tips',
      date: '2024-08-01',
      title: 'Top 10 Tips for Booking the Best Hotel'
    },
    {
      link: '/blog/13',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/f6/7f/f67f2d841e5dd805b76c46f372a9a985ff78a67f.PNG',
      category: 'Places to Travel',
      date: '2024-07-25',
      title: 'How to Choose a Family-Friendly Hotel'
    },
    {
      link: '/blog/14',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/18/c8/18c83cadec73bf09791cdd18c668fc991b0e8e8a.PNG',
      category: 'Places to Travel',
      date: '2024-07-20',
      title: 'Luxury Hotel Booking Guide'
    }
  ];

  isLoading = false;

  addMorePosts(): void {
    this.isLoading = true;

    // Simulate a delay for loading new posts
    setTimeout(() => {
      const newPosts: BlogPost[] = [
        {
          link: '/blog/15',
          imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
          category: 'Example Category 1',
          date: '2024-07-15',
          title: 'Budget Travel: Finding Affordable Hotels'
        },
        {
          link: '/blog/16',
          imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
          category: 'Example Category 2',
          date: '2024-07-10',
          title: 'Top Destinations for Hotel Stays in 2024'
        },
        {
          link: '/blog/17',
          imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
          category: 'Example Category 2',
          date: '2024-06-15',
          title: 'Luxury Hotels You Must Visit in 2024'
        }

      ];

      this.posts = [...this.posts, ...newPosts];
      this.isLoading = false;
    }, 2000); // Adjust the delay time as needed
  }
}
