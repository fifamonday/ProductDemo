import { z } from "zod";
// หน้าที่หลักมี 4 อย่าง
// 1. กำหนดหมวดหมู่
// 2. กำหนด Schema
// 3. สร้าง Type
// 4. เรียก API

// รายชื่อหมวดหมู่ คัดลอกจาก
// https://dummyjson.com/products/category-list
export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

export const ProductSchema = z.object({ // “ใช้ Zod ตรวจสอบว่าข้อมูลสินค้าที่ได้รับมีรูปแบบถูกต้องหรือไม่” // ตรวจสอบ สินค้า 1 ชิ้น
  // ใช้ Zod ตรวจสอบว่าข้อมูลที่กรอกถูกต้องหรือไม่
  id: z.number(),

  title: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า"),

  price: z
    .number({ error: "กรุณากรอกราคา" })
    .min(0, "ราคาต้องไม่ติดลบ"),

  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),

  category: z.enum(CATEGORIES, {
    error: "กรุณาเลือกหมวดหมู่",
  }),

  description: z.string().trim().optional(),

  // รูปสินค้าจาก API
  thumbnail: z.string().optional(),
});

export const ProductListSchema = z.object({ //ตรวจสอบ ข้อมูลสินค้าทั้งชุดจาก API
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// Type ที่สร้างจาก Schema //หมายถึงเอา Schema มาสร้าง Type สำหรับ TypeScript
export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

// Schema ของข้อมูลที่กรอกจากฟอร์ม
// ไม่ต้องกรอก id และรูป เพราะ id สร้างตอนเพิ่มสินค้า
// ส่วนรูปมาจาก API
export const ProductDraftSchema = ProductSchema.omit({
  id: true,
  thumbnail: true,
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

// // URL หลักของ API ที่ใช้ดึงข้อมูลสินค้า
const API_BASE = "https://dummyjson.com";
// กำหนดช่องที่สามารถใช้เรียงสินค้าได้
export const SORT_FIELDS = ["title", "price", "stock"] as const;

// ตรวจสอบข้อมูลที่ใช้ค้นหาสินค้า
export const SearchQuerySchema = z.object({
  // คำค้นหา
  q: z.string().trim(),

  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),

  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// // กำหนดค่าเริ่มต้นตอนเปิดหน้าเว็บ
export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();

  params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");

  // ขอข้อมูลเฉพาะที่ใช้ในหน้าเว็บ
  params.set("select", "title,price,stock,category,thumbnail");

  const url = `${API_BASE}/products/search?${params.toString()}`;

  console.log("เรียก URL:", url);

  return url;
}

// เรียก API
export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query)); // fetch(buildProductUrl(query)) ไปเรียก API

  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }

  const data = await response.json();

  console.log("ข้อมูลที่ได้รับ:", data);

  const result = ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }

  return result.data;
}