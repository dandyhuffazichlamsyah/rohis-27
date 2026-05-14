"use client";

import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Login gagal");
      }

      window.location.href = "/admin";
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login gagal.");
    }
  }

  return (
    <section className="min-h-screen bg-cream px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-emerald-900/10 bg-white/80 p-8 shadow-glow">
        <div className="text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-950 text-gold">
            <LogIn className="h-7 w-7" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold text-emerald-950">Login Admin</h1>
          <p className="mt-2 text-sm text-emerald-950/60">Masukkan password admin untuk mengelola data Rohis.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-bold text-emerald-950">
            Password
            <input name="password" type="password" required className="rounded-2xl border border-emerald-900/10 bg-cream px-4 py-3 font-normal outline-none transition focus:border-gold" placeholder="Password admin" />
          </label>
          {message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p> : null}
          <button disabled={status === "loading"} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800 disabled:opacity-70">
            <LogIn className="h-4 w-4" /> {status === "loading" ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="font-bold text-emerald-800 transition hover:text-gold">Kembali ke beranda</Link>
        </div>
      </div>
    </section>
  );
}
