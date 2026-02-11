"use client";
import { useState } from "react";

const PASSWORD_KEY = "admin_password_passed";
const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [authed, setAuthed] = useState(typeof window !== "undefined" && localStorage.getItem(PASSWORD_KEY) === "true");

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const password = form.password.value;
    if (password === PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, "true");
      setAuthed(true);
    } else {
      alert("あいことばが違います");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <form
          onSubmit={handleAuth}
          className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-80"
        >
          <h2 className="text-lg font-bold text-center">あいことば</h2>
          <input
            name="password"
            type="text"
            className="border p-2 rounded"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded font-bold"
          >
            認証する
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuth;
