import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any = {
    fullname: '',
    username: '',
    citizen: '',
    email: '',
    mobile: '',
    dob: '',
  };

  originalProfileData: any = {}; // Storing original profile data for comparison

  passwordData: any = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  userData: any;
  selectedGender: string = '';
  showSuccessModal: boolean = false;
  isModalVisible: boolean = false; // For password confirmation modal

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.userData = sessionStorage.getItem('user');
    if (!this.userData) {
      console.error('User not logged in.');
      this.router.navigate(['/login']);
      return;
    }
  
    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
  
    this.http.get<any>(`${environment.baseUrl}/profile`, { headers }).subscribe(
      (data) => {
        // Assuming the profile information is in the 'response' field of the API response
        this.profileData = { ...data.response };
        console.log(this.profileData);
  
        // Storing original data for comparison during profile updates
        this.originalProfileData = { ...data.response };
  
        // Setting gender field for form
        this.selectedGender = data.response.gender || '';
  
        // Handle null values in mobile and dob fields
        this.profileData.mobile = this.profileData.mobile || '';
        this.profileData.dob = this.profileData.dob || '';
      },
      (error) => {
        console.error('Error fetching profile', error);
      }
    );
  }
  

  onSubmit(profileForm: any): void {
    if (!profileForm.valid) {
      return;
    }

    const updatedProfile = this.prepareUpdatedFields();
    if (Object.keys(updatedProfile).length === 0) {
      console.log('No changes made to profile.');
      return;
    }

    this.loadingService.show();

    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.http.post<any>(`${environment.baseUrl}/update-profile`, updatedProfile, { headers }).subscribe(
      (response) => {
        this.loadingService.hide();
        this.showSuccessModal = true;
        this.getProfile(); // Refresh profile after update
      },
      (error) => {
        this.loadingService.hide();
        console.error('Error updating profile', error);
      }
    );
  }

  onChangePassword(passwordForm: any): void {
    if (!passwordForm.valid || this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }

    this.loadingService.show();
    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    const passwordPayload = {
      oldPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.http.post<any>(`${environment.baseUrl}/reset-password`, passwordPayload, { headers }).subscribe(
      (response) => {
        this.loadingService.hide();
        this.showSuccessModal = true;
        this.clearPasswordData();
      },
      (error) => {
        this.loadingService.hide();
        console.error('Error changing password', error);
      }
    );
  }

  prepareUpdatedFields(): { [key: string]: any } {
    const updatedProfile: { [key: string]: any } = {};

    if (this.profileData.fullname !== this.originalProfileData.fullname) {
      updatedProfile['fullname'] = this.profileData.fullname;
    }
    if (this.profileData.username !== this.originalProfileData.username) {
      updatedProfile['username'] = this.profileData.username;
    }
    if (this.profileData.citizen !== this.originalProfileData.citizen) {
      updatedProfile['citizen'] = this.profileData.citizen;
    }
    if (this.profileData.mobile !== this.originalProfileData.mobile) {
      updatedProfile['mobile'] = this.profileData.mobile;
    }
    if (this.profileData.dob !== this.originalProfileData.dob) {
      updatedProfile['dob'] = this.profileData.dob;
    }
    if (this.selectedGender !== this.originalProfileData.gender) {
      updatedProfile['gender'] = this.selectedGender;
    }

    return updatedProfile;
  }

  clearPasswordData(): void {
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  openConfirmationModal(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }

    this.isModalVisible = true; // Open the confirmation modal
  }

  closeModal(): void {
    this.isModalVisible = false; // Close the confirmation modal
  }

  confirmPasswordChange(): void {
    if (!this.isModalVisible) {
      return;
    }

    this.loadingService.show();
    this.isModalVisible = false;

    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    const passwordPayload = {
      oldPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.http.post<any>(`${environment.baseUrl}/reset-password`, passwordPayload, { headers }).subscribe(
      (response) => {
        this.loadingService.hide();
        this.showSuccessModal = true;
        sessionStorage.clear(); // Clear session data
        this.logout(); // Log out user after password change
      },
      (error) => {
        this.loadingService.hide();
        console.error('Error changing password', error);
      }
    );
  }

  logout(): void {
    this.loadingService.show();
    sessionStorage.removeItem('user');

    setTimeout(() => {
      this.router.navigate(['/login']).then(() => {
        location.reload(); // Reload the page after logout
      });
      this.loadingService.hide();
    }, 2000);
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
