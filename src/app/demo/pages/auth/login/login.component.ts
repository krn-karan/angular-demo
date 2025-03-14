import { Component } from '@angular/core';  
import { FormControl, Validators } from '@angular/forms';  
import { RouterModule } from '@angular/router';  
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf  
import { SharedModule } from 'src/app/demo/shared/shared.module';  
import { AuthService } from 'src/app/services/auth.service';

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
  constructor(private router: Router, private authService: AuthService) {}  

  getErrorMessage() {  
    if (this.email.hasError('required')) {  
      return 'You must enter an email';  
    }  
    return this.email.hasError('email') ? 'Not a valid email' : '';  
  }  
  
  login() {  
    if (!this.email.value ) {  
      this.email.markAsTouched();
      return;
    }  else if(!this.password.value){
      this.password.markAsTouched();
      return;
    }

    this.authService.login(this.email.value!, this.password.value!).subscribe(
      (response: any) => {
        this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard
      },
      (error) => {
        alert('Invalid email or password!');
      }
    );
  }
  
}  

