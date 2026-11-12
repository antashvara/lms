"use client";

import { useSession } from "next-auth/react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Belum login.</p>;
  }

  return (
    <main className="min-h-screen bg-[#0B0C0E] p-10 text-[#F2F0EA]">
      <h1 className="mb-6 text-2xl font-semibold">
        Auth Test
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Nama:</strong>{" "}
          {session.user.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {session.user.email}
        </p>

        <p>
          <strong>User ID:</strong>{" "}
          {session.user.id}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {session.user.role}
        </p>
      </div>
    </main>
  );
}