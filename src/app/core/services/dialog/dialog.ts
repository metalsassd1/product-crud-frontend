import { Injectable, signal } from '@angular/core';

interface DialogConfig {
  title?: string;
  message: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onConfirm: () => void; 
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isOpen = signal(false);
  
  config = signal<DialogConfig | null>(null);

  //  ฟังก์ชันหลักที่หน้าไหนก็เรียกใช้เพื่อสั่งเปิด Dialog
  open(config: DialogConfig) {
    this.config.set({
      title: config.title || 'ยืนยันรายการ',
      message: config.message,
      confirmBtnText: config.confirmBtnText || 'ยืนยัน',
      cancelBtnText: config.cancelBtnText || 'ยกเลิก',
      onConfirm: config.onConfirm
    });
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.config.set(null);
  }
}