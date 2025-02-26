import { Component } from '@angular/core';  
import { FormControl, Validators } from '@angular/forms';  
import { RouterModule } from '@angular/router';  
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf  
import { SharedModule } from 'src/app/demo/shared/shared.module';  

@Component({  
  selector: 'app-login',  
  standalone: true,  
  imports: [CommonModule, SharedModule, RouterModule], // Ensure CommonModule and ReactiveFormsModule are imported  
  templateUrl: './login.component.html',  
  styleUrls: ['./login.component.scss', '../authentication.scss']  
})  
export default class LoginComponent {  
  // Public properties  
  hide = true;  
  email = new FormControl('', [Validators.required, Validators.email]);  
  password = new FormControl('', [Validators.required]); // Ensure this is a FormControl instance  
  Email = '';  

  // constructor to inject Router  
  constructor(private router: Router) {}  

  // public method to get error messages for email  
  getErrorMessage() {  
    if (this.email.hasError('required')) {  
      return 'You must enter an email';  
    }  
    return this.email.hasError('email') ? 'Not a valid email' : '';  
  }  

  // login method to handle form submission  
  login() {  
    this.email.markAsTouched(); // Mark email as touched  
    this.password.markAsTouched(); // Mark password as touched  

    if (this.email.invalid || this.password.invalid) {  
      return; // Prevent submission if fields are invalid  
    }  

    // Example login check  
    if (this.Email === 'demo@gmail.com' && this.password.value === '1') {  
      this.router.navigate(['/dashboard']); // Redirect to dashboard on successful login  
    }  
  }  
}  