"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useAllProductsIncludingArchived, findProduct } from "@/lib/catalog-hooks";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const products = useAllProductsIncludingArchived();
  const product = findProduct(products, slug);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Edit Product</h1>
      <ProductForm existing={product} />
    </div>
  );
}
