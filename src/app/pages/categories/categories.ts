import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category/category';
import { AuthService } from '../../core/services/auth/auth';
import { SidebarComponent  } from '../../core/components/navbar/sidebar/sidebar';

@Component({
  selector: 'app-categories',
  standalone: true,
imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
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

  onDelete(id: number) {
    if (!confirm('คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => this.loadCategories()
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