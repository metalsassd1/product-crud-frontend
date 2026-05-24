import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage = '';
  loading = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.errorMessage = 'Username หรือ Password ไม่ถูกต้อง';
        this.loading = false;
      }
    });
  }
}