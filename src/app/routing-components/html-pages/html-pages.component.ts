import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-html-pages',
  templateUrl: './html-pages.component.html',
  styleUrls: ['./html-pages.component.css'],
  encapsulation : ViewEncapsulation.ShadowDom
})
export class HtmlPagesComponent {
  
  constructor(
    private activeRouter : ActivatedRoute,
    private loadingService : LoadingService,
    private http : HttpClient,
    private sanitizer: DomSanitizer) {
    }
  htmlContent:any = '';
  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      const pageName = params['data']
      this.getHtmlContent(pageName)
    });
  }
  getHtmlContent(page:any) {
    this.loadingService.show();
    this.http.get<any>(environment.baseUrl + `/dashboard/page/${page}`).subscribe(data => {
      this.loadingService.hide();
      this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(data.response?.htmlContent)
    }, error => {
      console.error('Error loading support tickets', error);
    });
  }
}
