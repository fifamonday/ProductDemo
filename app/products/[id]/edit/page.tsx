import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/app/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth(); // ตรวจ Login

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params; // เอา ID จาก URL แล้วเรียก DummyJSON เพื่อเอาข้อมูลสินค้ามาใส่ใน Form

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/");
  }

  const product = await response.json();

  const updateAction = updateProductAction.bind( //เมื่อกดบันทึกจะเรียก updateProductAction
    null,
    id
  );

  return (
    <main className="management-page">
      <div className="management-card">
        <h1>แก้ไขสินค้า</h1>

        <form
          action={updateAction}
          className="edit-form"
        >
          <div className="form-group">
            <label htmlFor="title">
              ชื่อสินค้า
            </label>

            <input
              id="title"
              name="title"
              defaultValue={product.title}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">
              ราคา
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.price}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">
              จำนวนคงเหลือ
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              defaultValue={product.stock}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              หมวดหมู่
            </label>

            <select
              id="category"
              name="category"
              defaultValue={product.category}
              required
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="management-actions">
            <button
              type="submit"
              className="primary-button"
            >
              บันทึก
            </button>

            <Link
              href="/"
              className="secondary-button"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
// กดแก้ไข
//    ↓
// edit/page.tsx
//    ↓
// แสดงฟอร์มแก้ไข
//    ↓
// กด "บันทึก"
//    ↓
// actions.ts
//    ↓
// updateProductAction()
//    ↓
// ส่ง PUT ไป API