import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number=0;
  @Input() itemsPerPage: number=0;
  @Input() totalItems: number=0;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.pageChanged.emit(this.currentPage);
    }
  }

  goToPreviousPage() {
    
    if (this.currentPage > 1) {
      this.currentPage--
      this.pageChanged.emit(this.currentPage)
    }
  }
}
