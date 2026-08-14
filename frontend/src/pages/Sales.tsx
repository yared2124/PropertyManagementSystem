import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { PageHeader, Panel, PrimaryButton, SecondaryButton } from "../components/common/Page";

const reportCards = [
  {
    label: "Total Revenue",
    value: "SAR 78,000",
    icon: CurrencyDollarIcon,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Open Leads",
    value: "12",
    icon: ChartBarIcon,
    tone: "bg-cyan-50 text-cyan-700",
  },
  {
    label: "Conversion Rate",
    value: "42%",
    icon: DocumentChartBarIcon,
    tone: "bg-violet-50 text-violet-700",
  },
];

export default function Sales() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Reports"
        description="Review revenue, occupancy, contract activity, and financial performance."
        action={
          <PrimaryButton>
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export Report
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {reportCards.map((card) => (
          <Panel key={card.label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {card.value}
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <div className="flex flex-wrap gap-3">
          <SecondaryButton>Revenue Report</SecondaryButton>
          <SecondaryButton>Occupancy Report</SecondaryButton>
          <SecondaryButton>Maintenance Report</SecondaryButton>
          <SecondaryButton>Profit and Loss</SecondaryButton>
        </div>
      </Panel>
    </div>
  );
}
