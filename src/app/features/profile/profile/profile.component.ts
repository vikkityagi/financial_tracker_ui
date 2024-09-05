// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { UserProfile } from '../../models/profile.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    id: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  };

  isEditing: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.profileService.getUserProfile()
      .subscribe(
        (profile) => this.profile = profile,
        (error) => console.error('Error fetching profile:', error)
      );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.profileService.updateUserProfile(this.profile)
      .subscribe(
        () => {
          this.isEditing = false;
          this.getProfile(); // Refresh profile data
        },
        (error) => console.error('Error saving profile:', error)
      );
  }
}
