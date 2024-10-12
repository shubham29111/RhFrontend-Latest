import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { environment } from 'src/environments/environments'; 

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
export class BlogsSectionComponent implements OnInit {
  posts: BlogPost[] = []; // All fetched blog posts
  visiblePosts: BlogPost[] = []; // Blog posts currently visible to the user
  isLoading = false;
  loadLimit = 3; // The number of posts to load at a time

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllBlogs();
  }

  // Fetch all blogs from the API
  fetchAllBlogs(): void {
    this.isLoading = true;
    const url = `${environment.baseUrl}/posts`;  // Simplified API endpoint
    
    this.http.get<any>(url).subscribe(
      (response) => {
        // Assuming response structure contains an array of blogs
        this.posts = response.response.map((post: any) => ({
          link: `/blog/${post.id}`,
          imageSrc: post.imageUrl,
          category: post.tags[0],  // Assuming the first tag as the category
          date: post.publishedDate,
          title: post.title
        }));
        this.visiblePosts = this.posts.slice(0, this.loadLimit);  // Show only the initial 3 posts
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching blog posts:', error);
        this.isLoading = false;
      }
    );
  }

  // Load more blogs
  loadMorePosts(): void {
    const nextIndex = this.visiblePosts.length + this.loadLimit;
    const morePosts = this.posts.slice(this.visiblePosts.length, nextIndex);
    this.visiblePosts = [...this.visiblePosts, ...morePosts];
  }
}
