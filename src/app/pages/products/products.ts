import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { CategoryService } from '../../core/services/category';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  loading = signal(false);
  showModal = signal(false);
  showDetailModal = signal(false);
  selectedProduct = signal<any>(null);
  editingId = signal<number | null>(null);
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  hasMore = signal(true);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.products.set(data);
        this.hasMore.set(data.length === this.pageSize);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data)
    });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadProducts();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', price: 0, stock: 0, categoryId: 0 });
    this.showModal.set(true);
  }

  openEdit(product: any) {
    this.editingId.set(product.id);
    this.form.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId
    });
    this.showModal.set(true);
  }

  openDetail(product: any) {
    this.selectedProduct.set(product);
    this.showDetailModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  closeDetail() {
    this.showDetailModal.set(false);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const id = this.editingId();

    const request = id
      ? this.productService.update(id, data)
      : this.productService.create(data);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
      }
    });
  }

  onDelete(id: number) {
    if (!confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts()
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadProducts();
  }

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  logout() {
    this.authService.logout();
  }

  get user() {
    return this.authService.getUser();
  }
}