import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

export type EthereumUsers = {
  id: number;
  Name: string | null;
  Email: string | null;
  EthAddress: string | null;
  Balance: number | null;
  IsActive: boolean | null;
  IsDeleted: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export type EthereumUsersForList = {
  id: number;
  name: string | null;
  email: string | null;
  ethAddress: string | null;
  balance: number | null;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  userForm: FormGroup;
  isPopupOpen = false;
  usersList: EthereumUsersForList[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'ethAddress', 'balance', 'isActive'];
  dataSource = new MatTableDataSource<EthereumUsersForList>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      Name: [''],
      Email: [''],
      EthAddress: [''],
      Balance: [0.0],
      IsActive: [true]
    });
  }

  ngOnInit() {
    this.loadUsers(); // Load users on component init
  }

  // ✅ Fetch Ethereum Users
  loadUsers() {
    this.authService.GetEthereumUsers().subscribe({
      next: (data) => {
        this.usersList = data; // ✅ Assign correctly
        this.dataSource.data = this.usersList; // ✅ Assign correctly
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // ✅ Open the popup with animation
  openPopup() {
    this.isPopupOpen = true;
  }

  // ✅ Close the popup
  closePopup() {
    this.isPopupOpen = false;
  }

  // ✅ Submit Form Data
  onSubmit() {
    const ethereumuser: EthereumUsers = {
      id: Math.floor(Math.random() * 1000), // Mock ID for fun
      Name: this.userForm.controls['Name'].value,
      Email: this.userForm.controls['Email'].value,
      EthAddress: this.userForm.controls['EthAddress'].value,
      Balance: this.userForm.controls['Balance'].value,
      IsActive: this.userForm.controls['IsActive'].value,
      IsDeleted: false,
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    };

    // Send data to API
    this.authService.EthereumUsers(ethereumuser).subscribe({
      next: (response) => {
        this.loadUsers(); // Refresh table after saving
        this.closePopup();
      },
      error: (error) => {
        alert("🚨 Invalid email or Ethereum address! Try again.");
      }
    });
  }

  onCancel() {
    this.closePopup();
  }
}
