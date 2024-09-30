import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup;

  constructor(private _fb:FormBuilder,private authService: AuthService,private shareService: SharedService,){
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
        next: response=>{
          const body = response.body;
          if(response.status === 201){
            this.signupForm.reset();
            this.shareService.updateData(body.id);
            this.authService.setLoggedIn(true);
          }else if(response.status === 200){
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
