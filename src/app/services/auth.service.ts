import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {AuthResponse, LoginRequest, RegisterRequest} from "../types/auth.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public BASE_URL = "http://localhost:8080";
  private loggedIn = signal<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/api/v1/auth/register`, registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/api/v1/auth/login`, loginRequest)
               .pipe(tap(response => {
                if(response && response.token) {
                  sessionStorage.setItem('authToken', response.token);
                  sessionStorage.setItem('refreshToken', response.refreshToken);
                  sessionStorage.setItem('name', response.name);
                  sessionStorage.setItem('email', response.email);

                  const decoded: any = jwtDecode(response.token);
                  sessionStorage.setItem('role', decoded.role[0].authority);
                }
               }));
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
  }

  // this will check if token is present as well as it is not expired
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('authToken');
    return token!=null && !this.isTokenExpired(token);
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.set(value);
  }

  getLoggedInSignal(): WritableSignal<boolean> {
    return this.loggedIn;
  }

  // If JWT expires, this method gives another JWT using refreshToken or proceeds to login page
  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    return this.http.post(`${this.BASE_URL}/api/v1/auth/refresh`, { refreshToken }).pipe(
      tap((res: any) => sessionStorage.setItem('authToken', res.token)),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    return (decoded.exp * 1000) < Date.now();
  }

  setToken(token: string) {
    sessionStorage.setItem('authToken', token);
  }

  hasRole(role: string): boolean {
    const token = sessionStorage.getItem('authToken'); // Retrieve the JWT
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.role[0]?.authority.includes(role); // Check if roles contain the required role
    }
    return false;
  }
}


