import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../demo/pages/auth/register/register.component';
import { EthereumUsers } from '../demo/pages/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7277/api/Users'; 

  constructor(private http: HttpClient) {}

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login?email=${email}&password=${password}`;
    return this.http.get(url);
  }

  GetLoginUsers(): Observable<any> {
    const url = `${this.apiUrl}/GetLoginUsers`;
    return this.http.get(url);
  }

  GetEthereumUsers(): Observable<any> {
    const url = `${this.apiUrl}/GetEthereumUsers`;
    return this.http.get(url);
  }
  EthereumUsers(ethereumuser: EthereumUsers): Observable<any> {
    debugger;
    const url = `${this.apiUrl}/PostEthereumUsers`;
    console.log('API URL:', url);  // ✅ Print URL in console
    return this.http.post(url, ethereumuser);
  }
  
}
