import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function Chat() {
  const [message, setMessage] = useState("");
  const chats = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Contract signed!",
      time: "2 min ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Maintenance request approved",
      time: "1 hour ago",
      unread: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600">Real-time communication</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{chat.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{chat.time}</p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full mt-1">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[70%] bg-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800">Contract signed!</p>
                  <p className="text-xs text-gray-400 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-blue-600 text-white rounded-lg p-3">
                  <p className="text-sm">Great news!</p>
                  <p className="text-xs text-blue-100 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
