import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import api from "../api/client";
import coverImage from "../assets/cover.png";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: "TENANT",
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(214,183,125,0.12),transparent_22rem),linear-gradient(135deg,#f8f5f0_0%,#f3efe8_50%,#f7f3ee_100%)] px-4 py-8 sm:px-6">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#8a6730]"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-[#d9c7a2] bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#c9a96d] hover:text-[#8a6730]"
              >
                Login
              </Link>
            </div>

            <div className="rounded-3xl border border-[#e8dfd1] bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f172a] text-[#d6b77d]">
                  <BuildingOffice2Icon className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-black tracking-normal text-slate-950">
                  Create account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Start as a tenant and access your contracts, payments, and
                  maintenance requests.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                autoComplete="off"
              >
                <div className="hidden">
                  <input type="text" name="fakeEmail" value="" readOnly />
                  <input
                    type="password"
                    name="fakePassword"
                    value=""
                    readOnly
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      autoComplete="off"
                      className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      autoComplete="off"
                      className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    autoComplete="off"
                    className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 py-3 text-sm font-black text-white shadow-[0_16px_36px_rgba(24,32,48,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b2c3d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={coverImage}
            alt="Modern property management"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f172a]/72" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,183,125,0.28),transparent_22rem),radial-gradient(circle_at_20%_75%,rgba(16,185,129,0.18),transparent_24rem)]" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d6b77d] to-[#8a6730] text-sm font-black text-[#0f172a]">
                PM
              </span>
              <span className="text-lg font-black tracking-wide">
                EstateFlow
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-[#f6e6bf] backdrop-blur">
                <ShieldCheckIcon className="h-4 w-4" />
                Tenant access
              </div>
              <h2 className="mt-5 text-5xl font-black tracking-normal">
                A clear portal for every property relationship.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Track contract details",
                  "View payment status",
                  "Request maintenance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-[#d6b77d]" />
                    <span className="text-sm font-semibold text-slate-100">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
