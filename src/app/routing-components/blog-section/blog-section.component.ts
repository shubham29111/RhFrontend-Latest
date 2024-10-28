import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

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
    this.loadBlogs();

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loadBlogById(this.id)
       
      }
    });
  }

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

  loadBlogById(id: string): void {
    const selectedBlog = this.blogs.find(b => b.id === id);
    if (selectedBlog) {
      this.blog = selectedBlog;
      this.formatBlogContent(this.blog.content);
    }
  }

  formatBlogContent(content: string): void {
    this.formattedContent = content
      .split(/\d+\.\s/)  // Splitting by numbered points in content
      .filter(Boolean)
      .map((point: string, idx: number) => `${idx + 1}. ${point.trim()}`);

    this.scrollToTop();  // Scroll to the top when a new blog is loaded
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
