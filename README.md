# ProductCRUD
Angular C#.net

# ติดตั้ง Library และ Dependency ในโปรเจกต์ (Restore Packages)
Bash
npm install

# เชื่อมต่อ API หลังบ้าน (Environment Setup)
ตั้งค่า Endpoint เพื่อตรวจสอบว่าชี้ไปยังพอร์ตของ Backend API ได้ถูกต้อง:
TypeScript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5084/api' // 
};

# รันระบบ Frontend ด้วย Angular Development Server
สั่งเปิดใช้งานเว็บเซอร์วิสหน้าบ้าน:
Bash
ng serve
