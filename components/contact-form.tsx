"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      nama: String(formData.get("nama") ?? ""),
      email: String(formData.get("email") ?? ""),
      pesan: String(formData.get("pesan") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Pesan gagal dikirim");
      }

      event.currentTarget.reset();
      setSubmitState("success");
      setMessage(result.message ?? "Pesan berhasil dikirim.");
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Pesan gagal dikirim.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm">
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-bold text-emerald-950">
          Nama
          <input name="nama" required minLength={3} className="rounded-2xl border border-emerald-900/10 bg-cream px-4 py-3 font-normal outline-none transition focus:border-gold" placeholder="Nama lengkap" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-emerald-950">
          Email
          <input name="email" type="email" required className="rounded-2xl border border-emerald-900/10 bg-cream px-4 py-3 font-normal outline-none transition focus:border-gold" placeholder="nama@email.com" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-emerald-950">
          Pesan
          <textarea name="pesan" required minLength={10} rows={6} className="resize-none rounded-2xl border border-emerald-900/10 bg-cream px-4 py-3 font-normal outline-none transition focus:border-gold" placeholder="Tulis pesan Anda" />
        </label>
        {message ? (
          <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${submitState === "success" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        ) : null}
        <button disabled={submitState === "loading"} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
          {submitState === "loading" ? "Mengirim..." : "Kirim Pesan"} <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
