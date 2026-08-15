import {
  AcademicCapIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { PageHeader, Panel, PrimaryButton, SecondaryButton } from "../components/common/Page";

const skills = [
  {
    title: "HVAC Technician",
    employees: "3 employees",
    tags: ["Certified", "Available"],
  },
  {
    title: "Plumbing",
    employees: "2 employees",
    tags: ["On call"],
  },
  {
    title: "Electrical",
    employees: "4 employees",
    tags: ["Certified"],
  },
];

export default function Skills() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Skills"
        description="Track employee capabilities, certification status, and maintenance coverage."
        action={
          <PrimaryButton>
            <PlusIcon className="h-5 w-5" />
            Add Skill
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <Panel key={skill.title} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950">{skill.title}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <UserGroupIcon className="h-4 w-4" />
                  {skill.employees}
                </p>
              </div>
              <SecondaryButton>Manage</SecondaryButton>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
