// แสดงระบบค้นหาและรายการสินค้า
import ProductExplorer from "./components/ProductExplorer";

// ตรวจสอบสถานะ Login
import { auth } from "@/auth";

// แสดงปุ่ม Login / Logout
import { AuthButtons } from "./components/auth-buttons";

// หน้าแรกของเว็บไซต์
export default async function Home() {

  // ตรวจสอบว่า User Login หรือไม่
  const session = await auth();

  // เก็บสถานะ Login เป็น true / false
  const isLoggedIn = Boolean(session?.user);

  return (
    <>
      {/* // แสดงปุ่ม Login / Logout */}
      <AuthButtons
        isLoggedIn={isLoggedIn}
        userName={session?.user?.name}
      />
{/* 
      // แสดงรายการและระบบจัดการสินค้า */}
      <ProductExplorer
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
// ProductExplorer → จัดการสินค้า
// auth() → ตรวจสอบ Login
// isLoggedIn → เก็บสถานะ Login
// AuthButtons → ปุ่ม Login / Logout

// มันทำ 2 อย่าง
// เช็กว่า Login หรือยัง
// ส่งข้อมูลไปให้ AuthButtons และ ProductExplorer

// “หน้า page.tsx เป็น Server Component ที่ใช้ auth() ตรวจสอบ Session แล้วส่งสถานะ Login ไปให้ส่วนปุ่ม Login และส่วนแสดงสินค้า”