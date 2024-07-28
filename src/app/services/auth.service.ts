import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public BASE_URL = "http://localhost:8080";
  private loggedIn = signal<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/api/v1/auth/authenticate`, loginRequest)
               .pipe(tap(response => {
                if(response && response.token) {
                  sessionStorage.setItem('authToken', response.token);
                  sessionStorage.setItem('refreshToken', response.refreshToken);
                  sessionStorage.setItem('name', response.name);
                  sessionStorage.setItem('username', response.username);
                  sessionStorage.setItem('email', response.email);
                }
               }));
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.set(value);
  }

  getLoggedInSignal(): WritableSignal<boolean> {
    return this.loggedIn;
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/v1/auth/register`, registerRequest);
  }
}

export type LoginRequest = {
  email: string,
  password: string,
}

export type RegisterRequest = {
  name: string,
  email: string,
  username: string,
  password: string,
}

export type AuthResponse = {
  token: string,
  refreshToken: string,
  name: string,
  username: string,
  email: string,
}

