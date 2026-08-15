import { useState } from "react";
import {
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { IconButton, PageHeader, Panel, SecondaryButton } from "../components/common/Page";

const typeStyles = {
  success: {
    icon: CheckCircleIcon,
    tone: "bg-emerald-50 text-emerald-700",
  },
  warning: {
    icon: ClockIcon,
    tone: "bg-amber-50 text-amber-700",
  },
  info: {
    icon: BellIcon,
    tone: "bg-cyan-50 text-cyan-700",
  },
};

export default function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Payment Received",
      message: "SAR 4,500 received from John Doe",
      time: "2 hours ago",
      read: false,
      type: "success",
    },
    {
      id: 2,
      title: "Maintenance Request",
      message: "New maintenance request #MNT-2024-001",
      time: "5 hours ago",
      read: false,
      type: "warning",
    },
    {
      id: 3,
      title: "Contract Expiring",
      message: "Contract CT-2024-001 expires in 7 days",
      time: "1 day ago",
      read: true,
      type: "info",
    },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Stay updated with payments, contracts, maintenance, and system activity."
        action={<SecondaryButton>Mark All Read</SecondaryButton>}
      />

      <div className="space-y-3">
        {notifications.map((notif) => {
          const style = typeStyles[notif.type as keyof typeof typeStyles];
          const Icon = style.icon;

          return (
            <Panel
              key={notif.id}
              className={`p-4 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-slate-300/70 ${
                !notif.read ? "border-cyan-100 bg-cyan-50/40" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-950">{notif.title}</h4>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">
                      {notif.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notif.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
                  )}
                  <IconButton title="Dismiss notification" tone="slate">
                    <XMarkIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
