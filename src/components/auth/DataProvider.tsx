"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { useCouponStore } from "@/lib/store/coupon-store";
import { useGalleryStore } from "@/lib/store/gallery-store";

export function DataProvider() {
  useEffect(() => {
    useCatalogStore.getState().hydrate();
    useCouponStore.getState().hydrate();
    useGalleryStore.getState().hydrate();
  }, []);

  return null;
}
