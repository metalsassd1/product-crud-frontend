import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { CategoryService } from '../../core/services/category';
import { AuthService } from '../../core/services/auth';
import { NavbarComponent } from '../../core/components/navbar/navbar';
import { LoadingComponent } from '../../core/components/loading/loading';
import { EmptyStateComponent } from '../../core/components/empty-state/empty-state';
import { DialogService } from '../../core/services/dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private dialogService = inject(DialogService);
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

  selectedProductIds = signal<number[]>([]); // 🎯 เก็บ ID สินค้าทั้งหมดที่ยูสเซอร์ติ๊กเลือก

  // 🔄 1. ฟังก์ชันช่วยเช็กว่าเลือกสินค้าชิ้นนี้อยู่ไหม
  isProductSelected(id: number): boolean {
    return this.selectedProductIds().includes(id);
  }

  toggleSelectProduct(id: number) {
    const currentIds = this.selectedProductIds();
    if (currentIds.includes(id)) {
      this.selectedProductIds.set(currentIds.filter(item => item !== id));
    } else {
      this.selectedProductIds.set([...currentIds, id]);
    }
  }

  // 🔄 3. ฟังก์ชันติ๊กเลือกทั้งหมดในหน้าปัจจุบัน / เลิกเลือกทั้งหมด
  toggleSelectAll() {
    const currentProducts = this.products();
    if (this.selectedProductIds().length === currentProducts.length && currentProducts.length > 0) {
      this.selectedProductIds.set([]); // เลิกเลือกทั้งหมด
    } else {
      this.selectedProductIds.set(currentProducts.map(p => p.id)); // เลือกทุกชิ้นในหน้านี้
    }
  }

  onDelete(ids: number[]) {
  if (ids.length === 0) return;

  this.dialogService.open({
    title: 'ยืนยันการลบข้อมูล',
    message: `คุณแน่ใจใช่หรือไม่ว่าต้องการลบรายการที่เลือกทั้งหมดจำนวน ${ids.length} รายการ? (ลบแล้วกู้คืนไม่ได้)`,
    confirmBtnText: 'ยืนยันลบ',
    onConfirm: () => {
      // 💡 สมมติว่า productService.deleteBulk() รองรับการรับ Array [1, 2, 3] 
      // หรือหากไม่มี สามารถใช้ forkJoin ยิงลบพร้อมกันได้ครับ
      this.productService.deleteList(ids).subscribe({
        next: () => {
          this.selectedProductIds.set([]); // ล้างค่าที่เลือกไว้หลังลบสำเร็จ
          this.loadProducts(); // รีโหลดตาราง
        }
      });
    }
  });
}

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
    this.dialogService.open({
      title: 'ยืนยันการบันทึกข้อมูล',
      message: 'คุณตรวจสอบข้อมูลและยืนยันที่จะบันทึกรายการนี้ใช่หรือไม่?',
      confirmBtnText: 'ยืนยันบันทึก',
      onConfirm: () => {
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