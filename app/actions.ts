// ไฟล์นี้สำคัญสำหรับ แก้ไข + ลบ

"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() { // ก่อนแก้ไขหรือลบ ต้องตรวจว่า Login แล้ว
  const session = await auth(); // ตรวจว่าผู้ใช้ Login อยู่หรือไม่

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function updateProductAction( // แก้ไขสินค้า
  id: string,
  formData: FormData
) {
  await requireUser(); // แล้วเอาข้อมูลจาก Form

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const price = Number(
    formData.get("price")
  );

  const stock = Number(
    formData.get("stock")
  );

  const category = String(
    formData.get("category") ?? ""
  ).trim(); 

  if (!title) {
    throw new Error("กรุณากรอกชื่อสินค้า");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาสินค้าไม่ถูกต้อง");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("จำนวนคงเหลือไม่ถูกต้อง");
  }

  if (!category) {
    throw new Error("กรุณาเลือกหมวดหมู่");
  }

  /*
   * ตอนนี้ ProductExplorer ของเดิมใช้ DummyJSON
   * จึงส่งข้อมูลไปยัง DummyJSON API
   */
  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "PUT", // แล้วส่งไป DummyJSON ด้วย
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        stock,
        category,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `แก้ไขสินค้าไม่สำเร็จ สถานะ ${response.status}`
    );
  }

  revalidatePath("/");

  redirect("/");
}

export async function deleteProductAction(  // ลบสินค้า
  id: string
) {
  await requireUser();

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "DELETE", // แล้วส่งไป DummyJSON ด้วย
    }
  );

  if (!response.ok) {
    throw new Error(
      `ลบสินค้าไม่สำเร็จ สถานะ ${response.status}`
    );
  }

  revalidatePath("/");

  redirect("/");
}

// หลังแก้ไข/ลบมี revalidatePath("/"); แล้ว

// redirect("/");

// จำประโยคนี้:

// “หลังจากแก้ไขหรือลบข้อมูล จะ Revalidate หน้าแรกแล้ว Redirect กลับไปหน้าแรก”