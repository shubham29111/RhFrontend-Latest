import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments'; 

interface BlogPost {
  link: string;
  image: string;
  category: string;

  date: string;
  title: string;
}

@Component({
  selector: 'app-blogs-section',
  templateUrl: './blogs-section.component.html',
  styleUrls: ['./blogs-section.component.css']
})
export class BlogsSectionComponent implements OnInit {
  isLoading = false;
  posts: BlogPost[] = []; // Will hold all the fetched blog posts
  visiblePosts: BlogPost[] = []; // Posts visible to the user, loaded in batches
  loadLimit = 5; // Number of posts to load at a time

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllBlogs();
  }

  fetchAllBlogs(): void {
    this.isLoading = true;
    const url = `${environment.baseUrl}/posts`; 

    this.http.get<any>(url).subscribe(
      (response) => {
        // Assuming the API returns a "response" object with a list of blog posts
        this.posts = response.response.map((post: any) => ({
          link: `/blog/${post.id}`,
<<<<<<< HEAD
          image: post.image,
          category: post.tags[0],
=======
          imageSrc: post.image,
          category: post.tags[0],  // Assuming the first tag as the category
>>>>>>> 06bc90ff2be0d038f3d39eda59beabd6d7077602
          date: post.publishedDate,
          title: post.title
        }));

        // Sort posts by date, latest first
        this.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Load the first batch of posts
        this.visiblePosts = this.posts.slice(0, this.loadLimit);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
        this.isLoading = false;
      }
    );
  }

  loadMorePosts(): void {
    const nextIndex = this.visiblePosts.length + this.loadLimit;
    const morePosts = this.posts.slice(this.visiblePosts.length, nextIndex);

    // Append more posts to the visible posts array
    this.visiblePosts = [...this.visiblePosts, ...morePosts];
  }
}
