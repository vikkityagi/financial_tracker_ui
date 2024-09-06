import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup;

  constructor(private _fb:FormBuilder,private authService: AuthService){
    this.init();
  }

  init(){
    this.signupForm = this._fb.group({
      username: ['',[Validators.required]],
      email: ['',[Validators.required]],
      password: ['',[Validators.required]],
      confirmPassword: ['',[Validators.required]]
    })
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: data=>{
          if(data.status === 201){
            this.signupForm.reset();
          }else if(data.status === 200){
            alert("Please try again..")
          }
        },
        error: (err: HttpErrorResponse)=>{
          if(err.status === 400){
            alert("User already Registered...")
            return
          }
          alert(err.message)
        }
      })
      
    }
  }

}
