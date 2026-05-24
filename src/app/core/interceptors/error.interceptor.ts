import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth'; // 🎯 เปลี่ยน path ให้ตรงกับของสหาย
import { DialogService } from '../services/dialog/dialog'; // 🎯 เปลี่ยน path ให้ตรงกับของสหาย

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const dialogService = inject(DialogService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // 🚨 ดักจับสถานะ 401 (Unauthorized) ซึ่งหมายถึง Token หมดอายุ หรือไม่มีสิทธิ์
            if (error.status === 401) {

                // 1. สั่งเปิด Dialog แจ้งเตือนให้ผู้ใช้งานทราบทันที
                dialogService.open({
                    title: 'เซสชันหมดอายุ',
                    message: 'กรุณาล็อกอินใหม่เพื่อดำเนินการต่อ',
                    onConfirm: () => {

                        // 2. สั่งเคลียร์ Token และข้อมูลผู้ใช้ที่ค้างอยู่ในเครื่องทิ้ง
                        authService.logout();

                        // 3. ดีดผู้ใช้งานกลับไปยังหน้าล็อกอิน
                        router.navigate(['/login']);

                    }
                })
            }

            return throwError(() => error);
        })

    );
};