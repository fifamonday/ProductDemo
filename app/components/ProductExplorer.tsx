"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

import {
  defaultQuery,
  fetchProducts,
} from "../lib/products";

import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "../lib/products";

type LoadState =
  | "loading"
  | "error"
  | "ready";

type ProductExplorerProps = {
  isLoggedIn: boolean;
};

export default function ProductExplorer({
  isLoggedIn,
}: ProductExplorerProps) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [status, setStatus] =
    useState<LoadState>("loading");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [editing, setEditing] =
    useState<Product | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );

    setStatus("error");
  }

  async function loadProducts(
    query: SearchQuery
  ) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(
        await fetchProducts(query)
      );
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery)
      .then(showResult)
      .catch(showError);
  }, []);

  function saveProduct(
    draft: ProductDraft
  ) {
    if (editing) {
      setProducts(
        products.map((product) =>
          product.id === editing.id
            ? {
                ...draft,
                id: editing.id,
                thumbnail: editing.thumbnail,
              }
            : product
        )
      );

      setEditing(null);
    } else {
      setProducts([
        ...products,
        {
          ...draft,
          id: Date.now(),
          thumbnail: "",
        },
      ]);
    }
  }

  function removeProduct(id: number) {
    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );

    if (editing?.id === id) {
      setEditing(null);
    }
  }

  function cancelEdit() {
    setEditing(null);
  }

  return (
    <main>
      <div className="page-heading">
        <div>
          <h1>รายการสินค้า</h1>
          <p>
            จัดการและดูข้อมูลสินค้าของคุณ
          </p>
        </div>

        <button
          type="button"
          className="load-button"
          onClick={() =>
            loadProducts(defaultQuery)
          }
          disabled={status === "loading"}
        >
          {status === "loading"
            ? "กำลังโหลด..."
            : "โหลดข้อมูล"}
        </button>
      </div>

      <div className="form-area">
        <ProductSearchForm
          onSearch={loadProducts}
        />

        <ProductForm
          key={editing?.id ?? "new"}
          editing={editing}
          onSave={saveProduct}
          onCancel={cancelEdit}
        />
      </div>

      <section
        className="products-section"
        aria-live="polite"
      >
        {status === "loading" && (
          <div className="status-box">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {status === "error" && (
          <p
            className="error-box"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {status === "ready" &&
          products.length === 0 && (
            <div className="empty-box">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </div>
          )}

        {status === "ready" &&
          products.length > 0 && (
            <div className="product-grid">
              {products.map((item) => (
                <article
                  className="product-card"
                  key={item.id}
                >
                  <div className="product-image">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                      />
                    ) : (
                      <div className="no-image">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-category">
                      {item.category}
                    </div>

                    <h2>
                      {item.title}
                    </h2>

                    <div className="product-info">
                      <div>
                        <span className="info-label">
                          ราคา
                        </span>

                        <strong className="product-price">
                          ฿{item.price.toLocaleString(
                            "th-TH"
                          )}
                        </strong>
                      </div>

                      <div className="stock">
                        <span className="info-label">
                          คงเหลือ
                        </span>

                        <span>
                          {item.stock} ชิ้น
                        </span>
                      </div>
                    </div>

                    {isLoggedIn && (
                      <div className="product-actions">
                        <Link
                          href={`/products/${item.id}/edit`}
                          className="edit-link"
                        >
                          แก้ไข
                        </Link>

                        <Link
                          href={`/products/${item.id}/delete`}
                          className="delete-link"
                        >
                          ลบ
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}