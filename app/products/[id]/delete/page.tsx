import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

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

  const deleteAction =
    deleteProductAction.bind(null, id);

  return (
    <main className="management-page">
      <div className="management-card delete-card">
        <h1>ยืนยันการลบ</h1>

        <p className="delete-question">
          ต้องการลบสินค้า
          {" "}
          <strong>{product.title}</strong>
          {" "}
          หรือไม่?
        </p>

        <p className="delete-warning">
          เมื่อลบแล้ว ข้อมูลสินค้านี้จะไม่สามารถเรียกคืนได้
        </p>

        <form action={deleteAction}>
          <div className="management-actions">
            <button
              type="submit"
              className="delete-button"
            >
              ยืนยันการลบ
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

// กดลบ
//    ↓
// delete/page.tsx
//    ↓
// แสดง "ต้องการลบไหม?"
//    ↓
// กด "ยืนยันการลบ"
//    ↓
// actions.ts
//    ↓
// deleteProductAction()
//    ↓
// ส่ง DELETE ไป API