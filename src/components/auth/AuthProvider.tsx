"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

export function AuthProvider() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return null;
}
