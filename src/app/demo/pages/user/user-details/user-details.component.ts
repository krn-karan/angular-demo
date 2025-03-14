import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  standalone: true,
  imports: [CommonModule], // needed for *ngIf
})
export class UserDetailComponent implements OnInit {
  ethAddress: string = '';
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private blockchainService: BlockchainService
  ) {}

  async ngOnInit() {
    this.ethAddress = this.route.snapshot.paramMap.get('ethAddress') || '';
  
    const result: any = await this.blockchainService.fetchUser(this.ethAddress);
  
    const userData = result.userData; 
  
    this.user = {
      userId: userData[0],
      userAddress: userData[1],
      name: userData[2],
      emailId: userData[3],
      contactNumber: userData[4]
    };
  }
  
}
