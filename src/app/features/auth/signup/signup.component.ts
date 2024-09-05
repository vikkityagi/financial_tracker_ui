import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup;

  constructor(private _fb:FormBuilder){
    this.init();
  }

  init(){
    this.signupForm = this._fb.group({
      username: [''],
      email: [''],
      password: [''],
      confirmPassword: ['']
    })
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
    }
  }

}
