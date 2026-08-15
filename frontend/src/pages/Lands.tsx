import { PlusIcon, ScaleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryButton,
} from "../components/common/Page";

export default function Lands() {
  const loading = false;

  if (loading) return <LoadingState label="Loading land assets..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assets"
        title="Lands"
        description="Track land holdings, zoning notes, market value, and future development plans."
        action={
          <PrimaryButton>
            <PlusIcon className="h-5 w-5" />
            <span>Add Land</span>
          </PrimaryButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Panel className="p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ScaleIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">
            Land management module
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This workspace is ready for land assets, plot documentation, zoning
            status, ownership records, and development planning once the backend
            endpoint is enabled.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Zoning", "Ownership", "Development"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">{item}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Coming soon
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <EmptyState
            title="No land assets yet"
            description="Connect a lands endpoint or add the first land record to start filling this view."
          />
        </Panel>
      </div>

      <Panel className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
          <SparklesIcon className="h-5 w-5 text-cyan-700" />
          <h3 className="text-sm font-black text-slate-900">
            Suggested fields for this page
          </h3>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Plot number", "Area size", "Market value", "Legal status"].map(
            (field) => (
              <div
                key={field}
                className="rounded-xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-700"
              >
                {field}
              </div>
            ),
          )}
        </div>
      </Panel>
    </div>
  );
}
