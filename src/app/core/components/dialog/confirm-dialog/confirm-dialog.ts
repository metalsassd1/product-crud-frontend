import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../services/dialog/dialog'; // 🎯 เรียกใช้บริการคลังแสงกลาง

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {
  // ฉีดคลังแสงกลางเข้าคอมโพเนนต์
  dialogService = inject(DialogService);

  onConfirm() {
    const config = this.dialogService.config();
    if (config?.onConfirm) {
      config.onConfirm(); // 🚀 รันฟังก์ชันอิสระที่หน้าแม่ส่งมาให้ทำ
    }
    this.dialogService.close(); // ทำงานเสร็จแล้วสั่งปิดกล่องทันที
  }

  onCancel() {
    this.dialogService.close(); // สั่งปิดกล่อง
  }
}