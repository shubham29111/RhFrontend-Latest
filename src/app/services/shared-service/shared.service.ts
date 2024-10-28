import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showLoginDropdown = new EventEmitter<void>();

  constructor() {}
}
