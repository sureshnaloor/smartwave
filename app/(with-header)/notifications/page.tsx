"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, Calendar, CheckCircle2 } from "lucide-react";

interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  eventDate?: string;
  createdAt: string;
  isRead?: boolean;
}

export default function EmployeeNotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const isEmployee = (session?.user as { role?: string })?.role === "employee";

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email || !isEmployee) {
      router.replace("/");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?includeRead=true");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [status, session, isEmployee, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-smart-teal/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-smart-teal" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Company updates, passes, and approvals from your admin.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-white/60 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              No notifications yet
            </h2>
            <p className="text-sm text-gray-500">
              When your company admin sends updates, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notifications.map((n) => {
              const isRead = n.isRead ?? false;
              return (
                <div
                  key={n._id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isRead
                      ? "bg-white/60 dark:bg-slate-900/60 border-gray-200/70 dark:border-slate-800"
                      : "bg-white dark:bg-slate-900 border-smart-teal/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          isRead ? "bg-gray-300" : "bg-smart-teal"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {n.title}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                          {n.type === "manual" ? "Announcement" : "System"}
                        </span>
                        {isRead && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Read
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-200"
                        }`}
                        dangerouslySetInnerHTML={{ __html: n.content }}
                      />
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        {n.eventDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Event: {new Date(n.eventDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Created: {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

