import { Component, inject, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  private router = inject(Router);

  // ข้อมูลเดิมของคุณ
  @Input() title = '';
  @Input() links: { navLabel: string; navPath: string; adminOnly?: boolean }[] = [];

  private authService = inject(AuthService);
  get isAdmin(): boolean { return this.authService.getUser()?.role === 'Admin'; }
  get user() { return this.authService.getUser(); }

  isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  goToPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.isMenuOpen.set(false); // กดปุ๊บหดเมนูกลับทันที
  }

  logout() {
    this.authService.logout();
  }
}