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
    // Use environment variables for endpoint and private key
    const providerUrl = environment.RPC_URL;
    const privateKey = environment.PRIVATE_KEY;

    // Connect to the XRP EVM Sidechain network
    this.provider = new ethers.JsonRpcProvider(providerUrl);

    // Initialize signer with private key
    this.wallet = new ethers.Wallet(privateKey, this.provider);


    // Fetch contract ABI
    this.fetchABI().then(abi => this.abi = abi);
  }

  // Fetch and parse the ABI from the local JSON file
  async fetchABI(): Promise<any> {
    try {
      const response = await this.http.get('/assets/abi.json').toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching ABI:', error);
      throw new Error('Failed to fetch contract ABI');
    }
  }

  // Function to add a user to the blockchain
  async addUser(userId: number, userName: string, email: string, ethereumAddress: string, contactNumber: string): Promise<string> {
    if (!this.abi) {
      this.abi = await this.fetchABI();
    }
  
    // Creating contract instance
    const contract = new ethers.Contract(this.contractAddress, this.abi, this.wallet) as ethers.Contract & { addUser: Function };
    const contractWithSigner = contract.connect(this.wallet) as ethers.Contract & { addUser: Function };
  
    try {
      // Correcting parameter order and adding the contact number
      const transactionResponse = await contractWithSigner.addUser(userId, ethereumAddress, userName, email,contactNumber);
  
      // Wait for the transaction to be mined
      const receipt = await transactionResponse.wait();
      return `${receipt.hash}`;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('Failed to add user. Please try again.');
    }
  }
  

  // Wrapper to call addUser and handle additional logic if needed
  async sendTransaction(userId: number, userName: string, email: string, ethereumAddress: string, contactNumber: string): Promise<string> {
      try {
        const addUserTxHash = await this.addUser(userId, userName, email, ethereumAddress, contactNumber);
        return addUserTxHash;
      } catch (error) {
        console.error('sendTransaction error:', error);
        throw error;
      }
    }

    // Function to fetch user details from the blockchain
async fetchUser(ethereumAddress: string): Promise<any> {
  try {
    if (!this.abi || this.abi.length === 0) {
      this.abi = await this.fetchABI();
    }

    const contract = new ethers.Contract(this.contractAddress, this.abi, this.provider);
    const contractWithSigner = contract.connect(this.wallet) as ethers.Contract & { fetchUser: Function };
    const userData = await contractWithSigner.fetchUser(ethereumAddress);

    return {
      userData
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

    
}