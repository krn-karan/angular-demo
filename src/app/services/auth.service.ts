import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../demo/pages/auth/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7277/api'; 

  constructor(private http: HttpClient) {}

  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/Users`, userData);
  }
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/Users?email=${email}&password=${password}`;
    return this.http.get(url);
  }
}
