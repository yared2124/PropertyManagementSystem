import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Vehicle } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  FilterSelect,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryLink,
  SearchInput,
} from "../components/common/Page";
import api from "../api/client";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get("/vehicles");
      setVehicles(data.data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle", error);
    }
  };

  const filtered = vehicles.filter((v) => {
    const term = search.toLowerCase();
    const matchesSearch =
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.licensePlate.toLowerCase().includes(term);
    return matchesSearch && (filterStatus ? v.status === filterStatus : true);
  });

  if (loading) return <LoadingState label="Loading vehicles..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fleet"
        title="Vehicles"
        description="Manage vehicle availability, rental rates, VINs, and fleet records."
        action={
          <PrimaryLink to="/vehicles/new">
            <PlusIcon className="h-5 w-5" />
            <span>Add Vehicle</span>
          </PrimaryLink>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            placeholder="Search vehicles..."
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
            title="No vehicles found"
            description="Try another search or add a new vehicle."
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => (
            <Panel
              key={vehicle.id}
              className="overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(148,117,64,0.15)]"
            >
              <div className="h-2 bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#d6b77d]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9f1e2] text-[#8a6730]">
                      <TruckIcon className="h-6 w-6" />
                    </div>
                    <h3 className="truncate text-lg font-black text-slate-950">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {vehicle.year} - {vehicle.licensePlate}
                    </p>
                  </div>
                  <StatusBadge status={vehicle.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f9f1e2] p-3">
                  <div>
                    <p className="text-xs font-bold text-[#8a6730]">Daily</p>
                    <p className="mt-1 font-black text-slate-900">
                      SAR {vehicle.dailyRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#8a6730]">Monthly</p>
                    <p className="mt-1 font-black text-slate-900">
                      SAR {vehicle.monthlyRate}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-[#8a6730]">VIN</p>
                    <p className="mt-1 truncate font-mono text-sm text-slate-700">
                      {vehicle.vin}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2 border-t border-[#eae0d0] pt-4">
                  <Link
                    to={`/vehicles/${vehicle.id}/edit`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9c7a2] bg-[#f9f1e2] text-[#8a6730] transition hover:bg-[#f0e4d0]"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
