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
        "name": "User  Added",
        "type": "event"
      }
    ];
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  async addUser (privateKey: string, userData: any) {
    try {
      debugger;
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(account);
  
      // Check the account balance
      const balance = await this.web3.eth.getBalance(account.address);
      console.log('Account Balance:', ethers.formatEther(balance), 'ETH');
  
      // Calculate the transaction cost
      const currentGasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = 210000; // Adjust as necessary
      const transactionCost = BigInt(currentGasPrice) * BigInt(gasLimit);
  
      if (BigInt(balance) < transactionCost) {
        throw new Error('Insufficient funds to cover transaction cost');
      }
  
      const nonce = await this.web3.eth.getTransactionCount(account.address);
      const jsonString = JSON.stringify(userData);
  
      const encoder = new TextEncoder();
      const byteArray = encoder.encode(jsonString);
      const dataHex = '0x' + Buffer.from(byteArray).toString('hex');
  
      // Set the gas prices with a buffer
      const maxPriorityFeePerGas = ethers.parseUnits((parseFloat(ethers.formatUnits(currentGasPrice, 'gwei')) + 10).toString(), 'gwei').toString();
      const maxFeePerGas = ethers.parseUnits((parseFloat(ethers.formatUnits(currentGasPrice, 'gwei')) + 20).toString(), 'gwei').toString();
  
      const tx = {
        from: account.address,
        to: this.contract.options.address,
        chainId: 1440002,
        nonce: nonce,
        data: dataHex,
        value: '0x0',
        gas: gasLimit,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasLimit: gasLimit
      };
  
      const signedTx = await this.web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transaction Error:', error);
      throw new Error('Transaction failed');
    }
  }

  async fetchUserHistory(userAddress: string) {
    try {
      const pastEvents = await this.contract.getPastEvents('User  Added', {
        filter: { user: userAddress }, // Filter by user address
        fromBlock: 0, // Fetch from the first block
        toBlock: 'latest' // Fetch up to the latest block
      });
  
      console.log('User History:', pastEvents);
      return pastEvents;
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw new Error('Failed to fetch user history');
    }
  }
  
  
  
  
}