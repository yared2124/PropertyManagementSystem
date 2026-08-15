import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Property } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  FilterSelect,
  ActionLink,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryLink,
  SearchInput,
} from "../components/common/Page";
import api from "../api/client";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    api
      .get("/properties")
      .then(({ data }) => setProperties(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? p.status === filterStatus : true),
  );

  if (loading) return <LoadingState label="Loading properties..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assets"
        title="Properties"
        description="Manage your property portfolio, rent status, values, and locations."
        action={
          <PrimaryLink to="/properties/new">
            <PlusIcon className="h-5 w-5" />
            <span>Add Property</span>
          </PrimaryLink>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            placeholder="Search properties..."
            value={search}
            onChange={setSearch}
          />
          <FilterSelect value={filterStatus} onChange={setFilterStatus}>
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          </FilterSelect>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel className="p-5">
          <EmptyState
            title="No properties found"
            description="Try changing your search or add a new property."
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <Panel
              key={property.id}
              className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(148,117,64,0.15)]"
            >
              <div className="h-2 bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#d6b77d]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9f1e2] text-[#8a6730]">
                      <BuildingOffice2Icon className="h-6 w-6" />
                    </div>
                    <h3 className="truncate text-lg font-black text-slate-950">
                      {property.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-[#8a6730]" />
                      <span className="truncate">{property.address}</span>
                    </p>
                  </div>
                  <StatusBadge status={property.status} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-[#f9f1e2] p-3 text-sm">
                  <div>
                    <p className="text-xs font-bold text-[#8a6730]">Area</p>
                    <p className="mt-1 font-black text-slate-900">
                      {property.area} m2
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#8a6730]">Beds</p>
                    <p className="mt-1 font-black text-slate-900">
                      {property.bedrooms || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#8a6730]">Baths</p>
                    <p className="mt-1 font-black text-slate-900">
                      {property.bathrooms || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-[#eae0d0] pt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400">Rent</p>
                    <p className="mt-1 text-base font-black text-slate-950">
                      SAR {property.rentalRate.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Value SAR {property.marketValue.toLocaleString()}
                    </p>
                  </div>
                  <ActionLink to={`/properties/${property.id}`} tone="gold">
                    View
                    <ArrowRightIcon className="h-4 w-4" />
                  </ActionLink>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
