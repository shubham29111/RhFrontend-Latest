import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments'; // Import the environment for base URL

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.css']
})
export class BlogSectionComponent implements OnInit {
  public formattedContent: string[] | undefined;
  public blog: any;
  public blogs: any[] = [];
  public selectedBlogIndex = 0;
id:any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Load all blogs initially using the API
    this.loadBlogs();

    // Get the selected blog ID from the route and load it dynamically
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        console.log("sss",this.id);
        this.loadBlogById(this.id)
       
      }
    });
  }

  // Fetch all blogs from the API
  loadBlogs(): void {
    this.http.get<any>(environment.baseUrl + '/posts').subscribe((response) => {
      if (response && response.response) {
        this.blogs = response.response;
        this.loadBlogById(this.id)
      }
    }, error => {
      console.error('Error fetching blogs:', error);
    });
  }

  // Fetch a single blog by ID from the API
  loadBlogById(id: string): void {
    const selectedBlog = this.blogs.find(b => b.id === id);
    if (selectedBlog) {
      this.blog = selectedBlog;
      this.formatBlogContent(this.blog.content);
    }
  }

  // Format blog content for numbered lists, etc.
  formatBlogContent(content: string): void {
    this.formattedContent = content
      .split(/\d+\.\s/)  // Splitting by numbered points in content
      .filter(Boolean)
      .map((point: string, idx: number) => `${idx + 1}. ${point.trim()}`);

    this.scrollToTop();  // Scroll to the top when a new blog is loaded
  }

  // Scroll to the top of the page when a blog is loaded
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
