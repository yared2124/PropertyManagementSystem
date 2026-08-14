import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
} from "../components/common/Page";

const events = {
  4: "Inspection",
  12: "Rent due",
  18: "Maintenance",
  25: "Contract review",
};

export default function Calendar() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        description="View all events and schedules across contracts, inspections, maintenance, and payments."
        action={
          <PrimaryButton>
            <PlusIcon className="h-5 w-5" />
            New Event
          </PrimaryButton>
        }
      />

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[#eae0d0] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9f1e2] text-[#8a6730]">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">August 2026</h2>
              <p className="text-sm font-medium text-slate-500">
                Monthly schedule
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton>
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </SecondaryButton>
            <SecondaryButton>Today</SecondaryButton>
            <SecondaryButton>
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </SecondaryButton>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-[#eae0d0] bg-[#f9f1e2]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-center text-xs font-black uppercase text-[#8a6730]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              type="button"
              className="min-h-24 border-b border-r border-[#eae0d0] bg-white p-3 text-left transition hover:bg-[#fffdfb] focus:outline-none focus:ring-4 focus:ring-inset focus:ring-[#f4e9d5]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-slate-700">
                {day}
              </span>
              {events[day as keyof typeof events] && (
                <span className="mt-3 block rounded-lg bg-[#0f172a] px-2 py-1 text-xs font-bold text-white">
                  {events[day as keyof typeof events]}
                </span>
              )}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
