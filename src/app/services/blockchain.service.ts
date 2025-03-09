import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';  // Import environment

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contractAddress = environment.CONTRACT_ADDRESS;
  private abi: ethers.InterfaceAbi = [];

  constructor(private http: HttpClient) {
    debugger;
    // Use environment variables for endpoint and private key
    const providerUrl = environment.RPC_URL;
    const privateKey = environment.PRIVATE_KEY;

    // Connect to the XRP EVM Sidechain network
    this.provider = new ethers.JsonRpcProvider(providerUrl);

    // Initialize signer with private key
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    console.log('Signer Address:', this.wallet.address);

    // Fetch contract ABI
    this.fetchABI().then(abi => this.abi = abi);
  }

  // Fetch and parse the ABI from the local JSON file
  async fetchABI(): Promise<any> {
    try {
      const response = await this.http.get('/assets/abi.json').toPromise();
      console.log('ABI fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching ABI:', error);
      throw new Error('Failed to fetch contract ABI');
    }
  }

  // Function to add a user to the blockchain
  async addUser(userId: number, userName: string, email: string, ethereumAddress: string, contactNumber: string): Promise<string> {
    debugger;
    if (!this.abi) {
      this.abi = await this.fetchABI();
    }
  
    // Creating contract instance
    const contract = new ethers.Contract("0x7F8b29DA30E24fa94Aa5F844502bE9c8361bA34b", this.abi, this.wallet) as ethers.Contract & { addUser: Function };
    const contractWithSigner = contract.connect(this.wallet) as ethers.Contract & { addUser: Function };
  
    try {
      debugger;
      // Correcting parameter order and adding the contact number
      const transactionResponse = await contractWithSigner.addUser(userId, ethereumAddress, userName, email,contactNumber);
  
      // Wait for the transaction to be mined
      const receipt = await transactionResponse.wait();
      console.log('Transaction successful:', receipt);
      return `User added successfully. Transaction hash: ${receipt.transactionHash}`;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('Failed to add user. Please try again.');
    }
  }
  

  // Wrapper to call addUser and handle additional logic if needed
  async sendTransaction(userId: number, userName: string, email: string, ethereumAddress: string, contactNumber: string): Promise<string> {
      try {
        const addUserTxHash = await this.addUser(userId, userName, email, ethereumAddress, contactNumber);
        console.log('User added with transaction hash:', addUserTxHash);
        return addUserTxHash;
      } catch (error) {
        console.error('sendTransaction error:', error);
        throw error;
      }
    }
}
