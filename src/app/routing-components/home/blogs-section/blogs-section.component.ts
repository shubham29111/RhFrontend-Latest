import { Component } from '@angular/core';

interface BlogPost {
  link: string;
  imageSrc: string;
  categoryLink: string;
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
      link: 'https://blog.zenhotels.com/best-travel-pillow/?ref=zenhotels-mainpage',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
      categoryLink: 'https://blog.zenhotels.com/best-travel-pillow/?ref=zenhotels-mainpage',
      category: 'Travel Tips',
      date: '6/27/2024',
      title: '8 Best Travel Pillows of 2024'
    },
    {
      link: 'https://blog.zenhotels.com/best-time-to-visit-hawaii/?ref=zenhotels-mainpage',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/f6/7f/f67f2d841e5dd805b76c46f372a9a985ff78a67f.PNG',
      categoryLink: 'https://blog.zenhotels.com/best-time-to-visit-hawaii/?ref=zenhotels-mainpage',
      category: 'Places to Travel',
      date: '6/20/2024',
      title: 'Best Time to Visit Hawaii'
    },
    {
      link: 'https://blog.zenhotels.com/best-things-to-do-in-tokyo/?ref=zenhotels-mainpage',
      imageSrc: 'https://cdn.worldota.net/t/x220/blog/18/c8/18c83cadec73bf09791cdd18c668fc991b0e8e8a.PNG',
      categoryLink: 'https://blog.zenhotels.com/best-things-to-do-in-tokyo/?ref=zenhotels-mainpage',
      category: 'Places to Travel',
      date: '6/12/2024',
      title: '25 Best Things to Do in Tokyo'
    }
  ];

  isLoading = false;

  addMorePosts(): void {
    this.isLoading = true;

    // Simulate a delay for loading new posts
    setTimeout(() => {
      const newPosts: BlogPost[] = [
        {
          link: 'https://blog.zenhotels.com/example-post-1',
          imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
          categoryLink: 'https://blog.zenhotels.com/example-category-1',
          category: 'Example Category 1',
          date: '7/1/2024',
          title: 'Example Post Title 1'
        },
        {
          link: 'https://blog.zenhotels.com/example-post-2',
          imageSrc: 'https://cdn.worldota.net/t/x220/blog/0b/e5/0be5d4b335fc2d7367cbb3d6e661321d4394be1e.PNG',
          categoryLink: 'https://blog.zenhotels.com/example-category-2',
          category: 'Example Category 2',
          date: '7/2/2024',
          title: 'Example Post Title 2'
        }
      ];

      this.posts = [...this.posts, ...newPosts];
      this.isLoading = false;
    }, 2000); // Adjust the delay time as needed
  }
}
