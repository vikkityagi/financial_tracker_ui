
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private _fb: FormBuilder,
    private authService: AuthService,
    private router: Router){
    this.init();
  }

  init(){
    this.loginForm = this._fb.group({
      email: [''],
      password:['']
    })
  }

  onSubmit(): void {
    this.router.navigate(['/dashboard']); 
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }

}
