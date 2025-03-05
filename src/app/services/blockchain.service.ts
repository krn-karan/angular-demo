import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private web3: Web3;
  private contract: any; // Replace with your contract type

  constructor() {
    // Connect to the XRP EVM network
    this.web3 = new Web3('https://rpc-evm-sidechain.xrpl.org/');
    // Initialize your contract here
    const contractAddress = '0x0149EA6f5dFf73289F7D5dd79600a32A986a67d6';
    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "userName",
            "type": "string"
          }
        ],
        "name": "addUser ",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "user",
            "type": "address"
          }
        ],
        "name": "User Added",
        "type": "event"
      }
    ];
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  async addUser(privateKey: any, userData: any) {
    try {
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(account);
  
      const nonce = await this.web3.eth.getTransactionCount(account.address);
      const jsonString = JSON.stringify(userData);
  
      const encoder = new TextEncoder();
      const byteArray = encoder.encode(jsonString);
  
      // Convert byteArray to hex string
      const dataHex = '0x' + Buffer.from(byteArray).toString('hex');
  
      const tx = {
        from: account.address,
        to: this.contract.options.address,
        chainId: 1440002,
        nonce: nonce,
        data: dataHex,
        value: '0x0',
        gas: 210000,
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei').toString(), // or adjust as needed
        maxFeePerGas: ethers.parseUnits('30', 'gwei').toString(), // Adjust based on current market rates
        gasLimit: 27880 // Ensure this is sufficient for your transaction
      };
  
      const signedTx = await this.web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transaction Error:', error);
      throw new Error('Transaction failed');
    }
  }
}