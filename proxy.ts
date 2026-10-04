export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/products/:id/edit", "/products/:id/delete"],
};

// ไฟล์นี้ทำหน้าที่ ป้องกันหน้าแก้ไขและลบ