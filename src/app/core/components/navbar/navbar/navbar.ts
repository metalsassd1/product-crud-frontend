import { Component, inject ,Input  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent {
    @Input() breadcrumbs: { label: string; path?: string }[] = [];
    private router = inject(Router);
    private authService = inject(AuthService);

    get user() { return this.authService.getUser(); }
    go(path: string) { this.router.navigate([`/${path}`]); }
    logout() { this.authService.logout(); }
}