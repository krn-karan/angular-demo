import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/demo/shared/shared.module';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-generate-transaction',
  imports: [ 
      FormsModule,
      SharedModule 
  ],
  templateUrl: './generate-transaction.component.html',
  styleUrls: ['./generate-transaction.component.scss']
})
export default class GenerateTransactionComponent {
  privateKey: string = '0x9f690e519c71544d4939982ec93328059ff592ff406d2d2d6ff68ea9c0052195';
  
  userData = {
    username: 1,
    email: "demoUser 123@example.com",
    password: "securePassword123", // Ensure this is hashed in a real application
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01", // YYYY-MM-DD format
    address: {
        street: "123 Demo St",
        city: "Demo City",
        state: "DC",
        zipCode: "12345",
        country: "USA"
    },
    phoneNumber: "+1234567890",
    profilePicture: "https://example.com/path/to/profile/picture.jpg", // URL to a profile picture
    createdAt: new Date().toISOString(), // Current date and time
    updatedAt: new Date().toISOString()  // Current date and time
  };

  constructor(private blockchainService: BlockchainService) {}

  async onAddUser () {
  }
}