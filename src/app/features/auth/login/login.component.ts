
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 2;

  loginForm!: FormGroup;
  

  
  

  constructor(private _fb: FormBuilder,
    private authService: AuthService,
    private router: Router){
    this.init();
  }

  init(){
    this.loginForm = this._fb.group({
      username: ['',Validators.required],
      password:['',Validators.required]
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const body = response.body;
          const username = this.loginForm.get('username')?.value;
          const password = this.loginForm.get('password')?.value;
          if(response.status === 200 && (body.username == username && body.password == password)){
              this.openSnackBar("Login successfully...");
              setTimeout(()=>{
                this.router.navigate(['/dashboard']); 
              },1000)
            return;
          }
          this.openSnackBar("User Not found");
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar("User Not found");
        }
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message },  // Pass the dynamic message
    });
  }

  


}
