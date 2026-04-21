"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Trash2, Loader2, Mail, MailOpen } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await fetchApi("/messages");
        if (data?.data) {
            setMessages(Array.isArray(data.data) ? data.data : data.data.data || []);
        } else {
             // Mock data
             setMessages([
                 { id: "1", name: "John Doe", email: "john@example.com", subject: "Project Inquiry", date: "2024-04-21", read: false },
                 { id: "2", name: "Jane Smith", email: "jane@example.com", subject: "Hello", date: "2024-04-20", read: true },
             ])
        }
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-slate-500">View and manage contact form submissions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Sender</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={24} />
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${!msg.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    <td className="p-4">
                      <div className="font-medium">{msg.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</div>
                    </td>
                    <td className="p-4">
                      {msg.subject || "No Subject"}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {msg.date}
                    </td>
                    <td className="p-4">
                      {msg.read ? (
                         <div className="flex items-center text-slate-500 text-sm">
                           <MailOpen size={14} className="mr-1" /> Read
                         </div>
                      ) : (
                         <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                           <Mail size={14} className="mr-1" /> Unread
                         </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
