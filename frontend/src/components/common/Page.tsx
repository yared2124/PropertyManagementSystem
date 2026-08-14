import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-black outline-none transition focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8] shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}

export function PrimaryLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`${buttonBase} bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#b98d46] px-4 py-3 text-white shadow-[0_12px_30px_rgba(24,32,48,0.25)] hover:brightness-110 focus-visible:ring-[#f4e9d5]`}
    >
      {children}
    </Link>
  );
}

export function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${buttonBase} bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#b98d46] px-4 py-3 text-white shadow-[0_12px_30px_rgba(24,32,48,0.25)] hover:brightness-110 focus-visible:ring-[#f4e9d5]`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${buttonBase} border border-[#d9c7a2] bg-[#f9f5ef] px-4 py-3 text-slate-700 shadow-sm transition hover:bg-[#f4ebdf] focus-visible:ring-[#f4e9d5]`}
    >
      {children}
    </button>
  );
}

export function ActionLink({
  to,
  children,
  tone = "gold",
}: {
  to: string;
  children: React.ReactNode;
  tone?: "gold" | "slate" | "violet" | "emerald";
}) {
  const tones = {
    gold: "border-[#d9c29c] bg-[#f9f1e2] text-[#8a6730] hover:border-[#c9a96d] hover:bg-[#f0e4d0] focus-visible:ring-[#f4e9d5]",
    slate:
      "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-100",
    violet:
      "border-violet-100 bg-violet-50 text-violet-800 hover:border-violet-200 hover:bg-violet-100 focus-visible:ring-violet-100",
    emerald:
      "border-emerald-100 bg-emerald-50 text-emerald-800 hover:border-emerald-200 hover:bg-emerald-100 focus-visible:ring-emerald-100",
  };

  return (
    <Link to={to} className={`${buttonBase} border px-3 py-2 ${tones[tone]}`}>
      {children}
    </Link>
  );
}

export function IconButton({
  children,
  title,
  onClick,
  tone = "gold",
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  tone?: "gold" | "emerald" | "rose" | "violet" | "slate";
}) {
  const tones = {
    gold: "border-[#d9c29c] bg-[#f9f1e2] text-[#8a6730] hover:bg-[#f0e4d0] focus-visible:ring-[#f4e9d5]",
    emerald:
      "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-100",
    rose: "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-100",
    violet:
      "border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100 focus-visible:ring-violet-100",
    slate:
      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-100",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`${buttonBase} h-9 w-9 border p-0 shadow-sm transition hover:-translate-y-0.5 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#eae0d0] bg-white shadow-[0_8px_24px_rgba(148,117,64,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c9a96d]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 pl-12 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#c9a96d] focus:ring-4 focus:ring-[#f4e9d5]"
      />
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#c9a96d] focus:ring-4 focus:ring-[#f4e9d5]"
    >
      {children}
    </select>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="rounded-2xl border border-[#eae0d0] bg-[#fffdf9] px-6 py-5 text-sm font-semibold text-slate-600 shadow-[0_8px_24px_rgba(148,117,64,0.06)]">
        {label}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9c29c] bg-[#f9f1e2] px-6 py-12 text-center">
      <p className="text-sm font-black text-[#8a6730]">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-6 text-[#a87a3a]">{description}</p>
      )}
    </div>
  );
}

export const tableClass = "w-full min-w-[760px]";
export const tableHeadClass =
  "border-b border-[#eae0d0] bg-[#f9f1e2] text-left text-xs uppercase text-[#8a6730]";
export const tableHeadCellClass = "px-5 py-3 font-black";
export const tableCellClass = "px-5 py-4 text-sm";
