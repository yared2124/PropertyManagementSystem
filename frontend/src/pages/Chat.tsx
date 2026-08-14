import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { PageHeader, Panel } from "../components/common/Page";

export default function Chat() {
  const [message, setMessage] = useState("");
  const chats = [
    {
      id: 1,
      name: "John Doe",
      role: "Tenant",
      lastMessage: "Contract signed!",
      time: "2 min ago",
      unread: 2,
      active: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Property Manager",
      lastMessage: "Maintenance request approved",
      time: "1 hour ago",
      unread: 0,
      active: false,
    },
  ];

  const messages = [
    { id: 1, body: "Contract signed!", time: "10:30 AM", fromMe: false },
    {
      id: 2,
      body: "Great news. I will update the contract status now.",
      time: "10:32 AM",
      fromMe: true,
    },
    {
      id: 3,
      body: "Thank you. Please send me the next payment schedule.",
      time: "10:34 AM",
      fromMe: false,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communication"
        title="Chat"
        description="Keep tenant, landlord, and property team conversations close to the work."
      />

      <div className="grid h-[680px] grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <Panel className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`mb-2 flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                  chat.active
                    ? "bg-[#0f172a] text-white shadow-lg shadow-[#b98d46]/30"
                    : "hover:bg-[#f9f1e2]"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    chat.active
                      ? "bg-[#d6b77d] text-[#0f172a]"
                      : "bg-[#f9f1e2] text-[#8a6730]"
                  }`}
                >
                  {chat.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-black">
                      {chat.name}
                    </span>
                    <span
                      className={`shrink-0 text-xs ${
                        chat.active ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {chat.time}
                    </span>
                  </span>
                  <span
                    className={`mt-1 block truncate text-xs font-medium ${
                      chat.active ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {chat.role} - {chat.lastMessage}
                  </span>
                </span>
                {chat.unread > 0 && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d6b77d] text-xs font-black text-[#0f172a]">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#eae0d0] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9f1e2] text-sm font-black text-[#8a6730]">
                JD
              </div>
              <div>
                <h3 className="font-black text-slate-950">John Doe</h3>
                <p className="text-sm font-medium text-emerald-600">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[PhoneIcon, VideoCameraIcon].map((Icon, index) => (
                <button
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9c7a2] bg-white text-[#8a6730] transition hover:border-[#c9a96d] hover:text-[#6a4d1f]"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fffdfb] p-5">
            <div className="space-y-4">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                      item.fromMe
                        ? "bg-[#0f172a] text-white"
                        : "border border-[#eae0d0] bg-white text-slate-800"
                    }`}
                  >
                    <p className="text-sm font-semibold leading-6">
                      {item.body}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        item.fromMe ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#eae0d0] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#c9a96d] focus:bg-white focus:ring-4 focus:ring-[#f4e9d5]"
              />
              <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d6b77d] text-[#0f172a] shadow-lg shadow-[#b98d46]/30 transition hover:bg-[#c9a96d]">
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
