// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { UserProfile } from '../../models/profile.model';
import { SharedService } from 'src/app/service/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  profileForm: any = FormGroup;

  isEditing: boolean = false;
  showError: string = '';

  constructor(private profileService: ProfileService,
    private shareService: SharedService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  init() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required]
    })
  }

  getProfile(): void {
    this.shareService.data$.subscribe({
      next: id => {
        if (id != null || id != 0) {
          this.profileService.getUserProfile(id).subscribe({
            next: data => {
              this.showError = "";
              this.profile = data.body;

            }, error: err => {
              console.error("Profile Error-" + err)
              this.showError = "Internal Server Error...";
            }
          })


        }
      }
    })

  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.init();
      this.loadProfile(this.profile);
    }

  }

  loadProfile(data: any) {
    this.profileForm.get('username')?.setValue(data.username);
    this.profileForm.get('email')?.setValue(data.email);
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
