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
import { BlockchainService } from 'src/app/services/blockchain.service';

export type EthereumUsers = {
  id: number;
  Name: string | null;
  Email: string | null;
  Hash: string | null;
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
  Hash: string | null;
  balance: number | null;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatedUsersForList = {
  id: number;
  firstName: string | null;
  lastName: string | null;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  userForm: FormGroup;
  isPopupOpen = false;
  usersList: EthereumUsersForList[] = [];
  createdUsersForList: CreatedUsersForList[] = [];
  selectUserList: SelectUserList[] = [{ name: 'Select User', value: 0 }];
  displayedColumns: string[] = ['id', 'name', 'email', 'ethAddress', 'balance', 'Hash'];
  dataSource = new MatTableDataSource<EthereumUsersForList>();
  privateKey: string = '0x9f690e519c71544d4939982ec93328059ff592ff406d2d2d6ff68ea9c0052195';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private blockchainService: BlockchainService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      Name: [''],
      Email: [''],
      EthAddress: [''],
      Balance: [0.0],
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
          name: (user.firstName || 'Unknown') + ' ' + (user.lastName || 'Unknown'),
          value: user.id || 0
        }));
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  loadUsers() {
    debugger;
    this.authService.GetEthereumUsers().subscribe({
      next: (data) => {
        debugger;
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

  async FetchuserDetails() {
    debugger;
    const userAddress = '0x0149EA6f5dFf73289F7D5dd79600a32A986a67d6';
    // try {
    //   //const Detail = await this.blockchainService.fetchUserHistory(userAddress);
    //   console.log('Fetched User Details:', Detail);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  }
  
  closePopup() {
    this.isPopupOpen = false;
  }

  // async onSubmit() {
  //   debugger;
  //   const ethereumuser: EthereumUsers = {
  //     id: Math.floor(Math.random() * 1000),
  //     Name: this.userForm.controls['Name'].value,
  //     Email: this.userForm.controls['Email'].value,
  //     EthAddress: this.userForm.controls['EthAddress'].value,
  //     Balance: this.userForm.controls['Balance'].value,
  //     IsActive: true,
  //     Hash: '',
  //     IsDeleted: false,
  //     CreatedAt: new Date(),
  //     UpdatedAt: new Date()
  //   };

  //   try {
  //     debugger;

  //     const txHash =  this.blockchainService.sendTransaction()
  //       .then(hash => {
  //         console.log("Transaction Hash:", hash);
  //       })
  //       .catch(error => {
  //         console.error("Error:", error);
  //       });
      
  //     ethereumuser.Hash = ""; // Store the transaction hash

  //     this.authService.EthereumUsers(ethereumuser).subscribe({
  //       next: () => {
  //         this.loadUsers();
  //         this.closePopup();
  //       },
  //       error: (error) => {
  //         alert("🚨 Invalid email or Ethereum address! Try again.");
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error adding user:', error);
  //   }
  // }

  async onSubmit() {
    debugger; 
    const hardcodedUser: EthereumUsers = {
      id: 1013,
      Name: "Karan" as string,
      Email: "kr.774561@gmail.com",
      EthAddress: "0x0149EA6f5dFf73289F7D5dd79600a32A986a67d6",
      Balance: 0,
      IsActive: true,
      Hash: '',
      IsDeleted: false,
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    };
  
    try {
      const txHash = await this.blockchainService.sendTransaction(
        hardcodedUser.id,
        hardcodedUser.Name!,
        hardcodedUser.Email!,
        hardcodedUser.EthAddress!,
        '9408513093' // Add the contact number here
      );
  
      console.log("✅ Transaction Hash:", txHash);
      hardcodedUser.Hash = txHash;
  
      this.authService.EthereumUsers(hardcodedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closePopup();
          console.log("✅ User saved to backend");
        },
        error: (error) => {
          console.error("❌ API Error:", error);
          alert("🚨 Failed to save user data to backend.");
        }
      });
  
    } catch (error) {
      console.error("❌ Blockchain Error:", error);
      alert("🚨 Failed to send transaction on blockchain.");
    }
  }
  

  onCancel() {
    this.closePopup();
  }
}
