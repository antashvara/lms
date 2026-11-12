"use client";

import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    const session = await getSession();

    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else if (session?.user?.role === "guru") {
      router.push("/guru");
    } else if (session?.user?.role === "siswa") {
      router.push("/siswa");
    } else if (session?.user?.role === "kurikulum") {
      router.push("/kurikulum");
    } else if (session?.user?.role === "kepala_sekolah") {
      router.push("/kepala-sekolah");
    } else {
      setError("Role pengguna tidak dikenali.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0C0E] text-[#F2F0EA] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm text-[#F59E0B] mb-3">
            ARUNIKA
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Selamat datang kembali
          </h1>

          <p className="mt-2 text-sm text-[#A4A3A0]">
            Masuk ke workspace LMS kamu.
          </p>
        </div>

        <div className="rounded-2xl border border-[#292B30] bg-[#111214] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-[#A4A3A0]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                className="w-full rounded-xl border border-[#292B30] bg-[#161719] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-[#A4A3A0]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full rounded-xl border border-[#292B30] bg-[#161719] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F59E0B] px-4 py-3 text-sm font-medium text-[#0B0C0E] transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#6F7072]">
          LMS Sekolah · Learning Management System
        </p>
      </div>
    </main>
  );
}