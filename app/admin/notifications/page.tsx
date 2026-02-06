"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Bell, Plus, Calendar, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "link",
];

interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  eventDate?: string;
  targetUserEmail?: string;
  readBy: Array<{ userEmail: string; readAt: string }>;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    eventDate: "",
    targetUserEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          eventDate: form.eventDate || undefined,
          targetUserEmail: form.targetUserEmail || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create notification");
      }

      toast.success("Notification created successfully");
      setCreateOpen(false);
      setForm({ title: "", content: "", eventDate: "", targetUserEmail: "" });
      await fetchNotifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  const getReadCount = (notification: Notification) => {
    return notification.readBy.length;
  };

  const getTotalEmployees = async () => {
    // This would need to be fetched from API, for now return 0
    return 0;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Notifications
            </h1>
            <p className="text-lg text-gray-600 dark:text-smart-silver/80">
              Create and manage notifications for your employees
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-smart-teal hover:bg-smart-teal/90 text-white rounded-xl px-6 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500">
              Create your first notification to keep your employees informed.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-smart-teal dark:hover:border-smart-teal transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-bold rounded bg-smart-teal/10 text-smart-teal border border-smart-teal/20">
                          {notification.type === "manual" ? "Manual" : "System"}
                        </span>
                      </div>
                      <div
                        className="text-sm text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: notification.content }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {notification.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Event: {new Date(notification.eventDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          Read by {getReadCount(notification)} employee(s)
                        </span>
                      </div>
                      <span>
                        Created: {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {notification.targetUserEmail && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          For: {notification.targetUserEmail}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 dark:bg-slate-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>
              Create a notification that will be sent to all your employees (or a specific employee).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Company Meeting Next Week"
                className="mt-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <div className="mt-1 notification-editor rounded-md">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, content: value }))
                  }
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Start typing to reveal the formatting toolbar. Use it to change
                colors, styles, lists, and links.
              </p>
            </div>
            <div>
              <Label htmlFor="eventDate">Event Date (Optional)</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="mt-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set a date for upcoming events or announcements
              </p>
            </div>
            <div>
              <Label htmlFor="targetUserEmail">Target Employee Email (Optional)</Label>
              <Input
                id="targetUserEmail"
                type="email"
                value={form.targetUserEmail}
                onChange={(e) => setForm({ ...form, targetUserEmail: e.target.value })}
                placeholder="Leave empty to notify all employees"
                className="mt-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to send to all employees, or specify an email for a specific employee
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setForm({ title: "", content: "", eventDate: "", targetUserEmail: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-smart-teal hover:bg-smart-teal/90"
            >
              {submitting ? "Creating..." : "Create Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
