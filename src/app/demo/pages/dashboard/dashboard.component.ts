import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { MatSelectModule } from '@angular/material/select';

export type EthereumUsers = {
  id: number;
  Name: string | null;
  Email: string | null;
  Hash: string | null;
  EthAddress: string | null;
  // Balance: number | null;
  IsActive: boolean | null;
  IsDeleted: boolean;
  CreatedAt: Date;
  Phoneno: string | null;
  UpdatedAt: Date;
};

export type EthereumUsersForList = {
  id: number;
  name: string | null;
  email: string | null;
  ethAddress: string | null;
  Hash: string | null;
  // balance: number | null;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatedUsersForList = {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  password: number | null;
};

export type SelectUserList = {
  name: string;
  value: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  userForm: FormGroup;
  isPopupOpen = false;
  isLoading = false; // Add loading state
  usersList: EthereumUsersForList[] = [];
  createdUsersForList: CreatedUsersForList[] = [];
  selectUserList: SelectUserList[] = [{ name: 'Select User', value: 0 }];
  displayedColumns: string[] = ['id', 'name', 'email', 'ethAddress', 'Hash'];
  dataSource = new MatTableDataSource<EthereumUsersForList>();
  privateKey: string = '0x9f690e519c71544d4939982ec93328059ff592ff406d2d2d6ff68ea9c0052195';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      Id: ['', Validators.required],
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      EthAddress: ['', Validators.required],
      Phoneno: ['', Validators.required],
      Hash: ['']
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.loadUserDropdownList();
  }

  loadUserDropdownList() {
    this.authService.GetLoginUsers().subscribe({

      next: (data) => {
        
        this.createdUsersForList = data;
        this.selectUserList = this.createdUsersForList.map(user => ({
          name: (user.firstname || 'Unknown') + ' ' + (user.lastname || 'Unknown'),
          value: user.id || 0
        }));
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  loadUsers() {
    this.authService.GetEthereumUsers().subscribe({
      next: (data) => {
        
        this.usersList = data;
        this.dataSource.data = this.usersList;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  openPopup() {
    this.isPopupOpen = true;
  }


  async onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Mark all controls as touched
      alert("🚨 Please fill out all required fields correctly."); // Add error message
      return;
    }

    this.isLoading = true; // Show loader
    const hardcodedUser: EthereumUsers = {
      id: this.userForm.controls['Id'].value,
      Name: this.userForm.controls['Name'].value,
      Email: this.userForm.controls['Email'].value,
      EthAddress: this.userForm.controls['EthAddress'].value,
      // Balance: this.userForm.controls['Balance'].value,
      IsActive: true,
      Hash: '',
      IsDeleted: false,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      Phoneno: this.userForm.controls['Phoneno'].value
    };

    try {
      const txHash = await this.blockchainService.sendTransaction(
        hardcodedUser.id,
        hardcodedUser.Name!,
        hardcodedUser.Email!,
        hardcodedUser.EthAddress!,
        hardcodedUser.Phoneno!, // Add the contact number here
      );

      hardcodedUser.Hash = txHash;

      this.authService.EthereumUsers(hardcodedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closePopup();
        },
        error: (error) => {
          console.error("❌ API Error:", error);
          alert("🚨 Failed to save user data to backend.");
        },
        complete: () => {
          this.isLoading = false; // Hide loader
        }
      });

    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      alert("🚨 Failed to send transaction on blockchain.");
      this.isLoading = false; // Hide loader
    }
  }


  closePopup() {
    this.isPopupOpen = false;
  }

  viewUserDetail(ethAddress: string) {
    this.router.navigate(['/user-detail', ethAddress]);
  }

}