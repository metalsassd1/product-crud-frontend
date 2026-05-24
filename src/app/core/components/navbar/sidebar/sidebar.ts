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
  @Input() links: { navLabel: string; navPath: string }[] = [];

  private authService = inject(AuthService);
  get user() { return this.authService.getUser(); }

  isMenuOpen = signal<boolean>(false);

  // 🔄 ฟังก์ชันสลับสถานะเปิด/ปิด
  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  // 🚀 ฟังก์ชันเปลี่ยนหน้า และสั่งปิดเมนูออโต้หลังจากกด
  goToPage(page: string) {
    this.router.navigate([`/${page}`]);
    this.isMenuOpen.set(false); // กดปุ๊บหดเมนูกลับทันที
  }

  logout() {
    this.authService.logout();
  }
}