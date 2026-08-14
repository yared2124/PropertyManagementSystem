import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import coverImage from "../assets/cover.png";

const features = [
  {
    title: "Property Portfolio",
    copy: "Track buildings, lands, vehicles, rent status, and ownership records from one organized workspace.",
    icon: BuildingOffice2Icon,
    tone: "bg-[#f9f1e2] text-[#8a6730]",
  },
  {
    title: "Contracts",
    copy: "Create leases, monitor active agreements, and keep key dates visible before they become urgent.",
    icon: ClipboardDocumentListIcon,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Payments",
    copy: "Follow paid, overdue, and upcoming payments with clear financial summaries for every role.",
    icon: BanknotesIcon,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Maintenance",
    copy: "Capture requests, prioritize work, and keep tenants and managers aligned on progress.",
    icon: WrenchScrewdriverIcon,
    tone: "bg-violet-50 text-violet-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0f172a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d6b77d] to-[#8a6730] text-sm font-black text-[#0f172a]">
              PM
            </span>
            <span className="text-lg font-black tracking-wide">EstateFlow</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              Features
            </a>
            <a
              href="#insights"
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              Insights
            </a>
            <a
              href="#security"
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              Security
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#b98d46]/20 transition hover:bg-[#f9f1e2]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={coverImage}
          alt="Modern property management workspace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f172a]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(214,183,125,0.25),transparent_22rem),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.22),transparent_24rem)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-4xl pb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-[#d6b77d] backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4" />
              Property operations platform
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal sm:text-6xl lg:text-7xl">
              EstateFlow Property Management
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Manage assets, tenants, leases, payments, maintenance, and reports
              through a clean system built for busy property teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d6b77d] px-5 py-3 text-sm font-black text-[#0f172a] shadow-xl shadow-[#b98d46]/30 transition hover:-translate-y-0.5 hover:bg-[#c9a96d]"
              >
                Start Managing
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:grid-cols-3">
            {[
              ["50+", "Managed assets"],
              ["15+", "Active contracts"],
              ["24/7", "Operational visibility"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#fffdfb] py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-[#8a6730]">
              Daily workflow
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Everything your team checks first, designed to be readable.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#eae0d0] bg-white p-6 shadow-xl shadow-[#b98d46]/10"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tone}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="bg-white py-20 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-[#8a6730]">
              Better decisions
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-normal">
              See the health of the business before opening a spreadsheet.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The dashboard brings together revenue, contracts, maintenance, and
              audit activity so managers can move quickly with context.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Revenue reports", ChartBarIcon],
              ["Audit history", ClipboardDocumentListIcon],
              ["Secure access", ShieldCheckIcon],
              ["Clear tasks", CheckCircleIcon],
            ].map(([label, Icon]) => (
              <div
                key={label as string}
                className="flex items-center gap-3 rounded-2xl border border-[#eae0d0] bg-[#f9f1e2] p-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f172a] text-[#d6b77d]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold">{label as string}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="bg-[#0f172a] py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-3xl font-black tracking-normal text-white">
              Ready to run your property operations from one place?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Create a tenant account or sign in to your workspace to continue.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0f172a] transition hover:bg-[#f9f1e2]"
          >
            Create Account
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
