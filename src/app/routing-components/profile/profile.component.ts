import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {


  selectedGender: string = '';

  onGenderSelect(event: any) {
    this.selectedGender = event.target.value;
    console.log('Selected Gender:', this.selectedGender);
  }
}
