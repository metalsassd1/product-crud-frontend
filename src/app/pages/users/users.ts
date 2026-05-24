import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user/user';
import { AuthService } from '../../core/services/auth/auth';
import { DialogService } from '../../core/services/dialog/dialog';
import { NavbarComponent } from '../../core/components/navbar/navbar/navbar';
import { SidebarComponent } from '../../core/components/navbar/sidebar/sidebar';
import { LoadingComponent } from '../../core/components/loading/loading';
import { EmptyStateComponent } from '../../core/components/empty-state/empty-state';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  users = signal<any[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    newPassword: [''],
    role: ['User', [Validators.required, Validators.pattern(/^(User|Merchant|Admin)$/)]]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openEdit(user: any) {
    this.editingId.set(user.id);
    this.form.setValue({
      username: user.username,
      newPassword: '',
      role: user.role
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.dialogService.open({
      title: 'ยืนยันการแก้ไขผู้ใช้',
      message: 'คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลผู้ใช้นี้ใช่หรือไม่?',
      confirmBtnText: 'ยืนยันบันทึก',
      onConfirm: () => {
        const id = this.editingId();
        if (!id) return;
        this.userService.update(id, this.form.value).subscribe({
          next: () => {
            this.closeModal();
            this.loadUsers();
          }
        });
      }
    });
  }

  onDelete(id: number, username: string) {
    this.dialogService.open({
      title: 'ยืนยันการลบผู้ใช้',
      message: `คุณต้องการลบผู้ใช้ "${username}" ออกจากระบบใช่หรือไม่?`,
      confirmBtnText: 'ยืนยันลบ',
      onConfirm: () => {
        this.userService.delete(id).subscribe({
          next: () => this.loadUsers()
        });
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'badge-admin';
      case 'Merchant': return 'badge-merchant';
      default: return 'badge-user';
    }
  }

  get user() { return this.authService.getUser(); }
}