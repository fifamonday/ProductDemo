"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function updateProductAction(
  id: string,
  formData: FormData
) {
  await requireUser();

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
      method: "PUT",
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

export async function deleteProductAction(
  id: string
) {
  await requireUser();

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      method: "DELETE",
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