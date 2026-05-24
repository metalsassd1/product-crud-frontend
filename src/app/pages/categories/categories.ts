import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category/category';
import { AuthService } from '../../core/services/auth/auth';
import { SidebarComponent } from '../../core/components/navbar/sidebar/sidebar';
import { LoadingComponent } from '../../core/components/loading/loading';
import { EmptyStateComponent } from '../../core/components/empty-state/empty-state';
import { NavbarComponent } from '../../core/components/navbar/navbar/navbar';
import { DialogService } from '../../core/services/dialog/dialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, LoadingComponent, EmptyStateComponent, NavbarComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  categories = signal<any[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  searchTerm = '';

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getAll(this.searchTerm).subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.loadCategories();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '' });
    this.showModal.set(true);
  }

  openEdit(cat: any) {
    this.editingId.set(cat.id);
    this.form.setValue({ name: cat.name, description: cat.description });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.dialogService.open({
      title: 'ยืนยันการบันทึก',
      message: 'คุณต้องการบันทึกข้อมูลหมวดหมู่นี้ใช่หรือไม่?',
      confirmBtnText: 'ยืนยันบันทึก',
      onConfirm: () => {
        const data = this.form.value;
        const id = this.editingId();
        const request = id
          ? this.categoryService.update(id, data)
          : this.categoryService.create(data);
        request.subscribe({
          next: () => {
            this.closeModal();
            this.loadCategories();
          }
        });
      }
    });
  }

  onDelete(id: number) {
    this.dialogService.open({
      title: 'ยืนยันการลบหมวดหมู่',
      message: 'คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่? สินค้าในหมวดหมู่นี้จะถูกลบด้วย',
      confirmBtnText: 'ยืนยันลบ',
      onConfirm: () => {
        this.categoryService.delete(id).subscribe({
          next: () => this.loadCategories()
        });
      }
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  logout() {
    this.authService.logout();
  }

  get user() {
    return this.authService.getUser();
  }
}