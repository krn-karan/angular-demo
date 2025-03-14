import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importing CommonModule  
import { MatInputModule } from '@angular/material/input'; // Ensure MatInputModule is imported  
import { MatCheckboxModule } from '@angular/material/checkbox'; // Importing MatCheckboxModule  
import { MatFormFieldModule } from '@angular/material/form-field'; // Importing MatFormFieldModule  
import { MatButtonModule } from '@angular/material/button'; // Importing MatButtonModule  
import { SharedModule } from 'src/app/demo/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs';

export type User = {
  firstName: string | null  ;
  lastName: string | null  ;
  email: string | null  ;
  password: string | null  ;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here  
    RouterModule,
    MatInputModule, // Ensure this is present  
    MatCheckboxModule, // Import checkbox  
    MatFormFieldModule, // Import form field (for mat-error)  
    MatButtonModule, // Import button module  
    SharedModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../authentication.scss']
})
export default class RegisterComponent {
  // Public properties  
  hide = true;
  coHide = true;

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPassword = new FormControl('', [Validators.required]);

  constructor(private authService: AuthService) {

  }

  // Validation messages  
  getFirstNameError() {
    return this.firstName.hasError('required') ? 'First Name is required' : '';
  }

  getLastNameError() {
    return this.lastName.hasError('required') ? 'Last Name is required' : '';
  }

  getEmailError() {
    if (this.email.hasError('required')) {
      return 'Email is required';
    }
    return this.email.hasError('email') ? 'Enter a valid email' : '';
  }

  getPasswordError() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return this.password.hasError('minlength') ? 'Password must be at least 6 characters' : '';
  }

  getConfirmPasswordError() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirm Password is required';
    }
    return this.confirmPassword.value !== this.password.value ? 'Passwords do not match' : '';
  }

  register() {

    // Mark all controls as touched to trigger validation messages  
    this.firstName.markAsTouched();
    this.lastName.markAsTouched();
    this.email.markAsTouched();
    this.password.markAsTouched();
    this.confirmPassword.markAsTouched();

    if (this.firstName.valid && this.lastName.valid && this.email.valid && this.password.valid && this.confirmPassword.valid) {
      if (this.password.value !== this.confirmPassword.value) {
        return;
      }
      const user : User= {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        password: this.password.value 
      }
      this.authService.register(user).subscribe(response => {
        alert('User Registered Successfully!');
      },
        error => {
          console.error('Error during registration', error);
          alert('Registration Failed!');
        }
      );
    } else {

    }
  }
}  