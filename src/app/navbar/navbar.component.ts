import { CommonModule } from '@angular/common';
import {Component, OnInit, signal} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isLoggedIn = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getName();
    this.isLoggedIn = this.authService.getLoggedInSignal();
  }

  getName(): string|null {
    return sessionStorage?.getItem('name');
  }

  logout(): void {
    this.authService?.logout();
    this.authService?.setLoggedIn(false);
    this.router.navigate(['login']).then(() => {
      sessionStorage.clear();
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
}
