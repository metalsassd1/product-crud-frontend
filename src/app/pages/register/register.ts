import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth'; // 🎯 ลิงก์ตรงเข้าไฟล์ auth.ts ของคุณ

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html', // 🎯 ชี้ไปหาไฟล์ HTML แยก
  styleUrl: './register.css'      // 🎯 ชี้ไปหาไฟล์ CSS แยก
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  //  สร้างฟอร์มสำหรับรับค่าสมัครสมาชิก
  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['User', Validators.required] // ตั้งค่าเริ่มต้นให้เป็นสิทธิ์ทั่วไป
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { username, password, role } = this.registerForm.value;

    this.authService.register(username!, password!, role!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('สมัครสมาชิกสำเร็จแล้ว! ระบบกำลังพากลับไปหน้าเข้าสู่ระบบ...');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    });
  }
}