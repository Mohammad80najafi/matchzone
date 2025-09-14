"use client";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  // token نمایش داده نمی‌شود در کلاینت؛ دکمه خروج داریم
  const [loading, setLoading] = useState(false);
  const onLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };
  return (
    <main style={{ padding: 24 }}>
      <h1>داشبورد</h1>
      <p>خوش آمدی 👋</p>
      <button
        onClick={onLogout}
        disabled={loading}
        style={{ padding: 10, borderRadius: 12, border: "1px solid #333" }}>
        {loading ? "در حال خروج..." : "خروج"}
      </button>
    </main>
  );
}
