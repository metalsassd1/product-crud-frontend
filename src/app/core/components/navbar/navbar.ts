import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: "./navbar.html",
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Input() title = '';
  @Input() navLabel = '';
  @Input() navPath = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  get user() { return this.authService.getUser(); }

  navigate() { this.router.navigate([this.navPath]); }
  logout() { this.authService.logout(); }
}