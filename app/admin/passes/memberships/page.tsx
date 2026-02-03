"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, User, Mail, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MembershipRequest {
    _id: string;
    userId: string;
    userEmail: string;
    userName: string;
    passId: string;
    passName: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
    approvedAt?: string;
    rejectedAt?: string;
}

export default function PassMembershipsPage() {
    const [memberships, setMemberships] = useState<MembershipRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        try {
            const res = await fetch("/api/admin/passes/memberships/approve");
            const data = await res.json();
            setMemberships(data.memberships || []);
        } catch (error) {
            console.error("Failed to fetch memberships:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (membershipId: string) => {
        setProcessing(membershipId);
        try {
            const res = await fetch("/api/admin/passes/memberships/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ membershipId, action: "approve" }),
            });

            if (!res.ok) {
                throw new Error("Failed to approve");
            }

            // Refresh memberships
            await fetchMemberships();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (membershipId: string) => {
        setProcessing(membershipId);
        try {
            const res = await fetch("/api/admin/passes/memberships/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ membershipId, action: "reject" }),
            });

            if (!res.ok) {
                throw new Error("Failed to reject");
            }

            // Refresh memberships
            await fetchMemberships();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessing(null);
        }
    };

    const filteredMemberships = memberships.filter((m) => {
        if (filter === "all") return true;
        return m.status === filter;
    });

    const pendingCount = memberships.filter((m) => m.status === "pending").length;
    const approvedCount = memberships.filter((m) => m.status === "approved").length;
    const rejectedCount = memberships.filter((m) => m.status === "rejected").length;

    return (
        <div className="min-h-screen bg-white dark:bg-black py-12">
            <div className="container mx-auto px-6 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Pass Membership Requests
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-smart-silver/80">
                        Review and manage user requests to join your passes
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "pending"
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Pending ({pendingCount})
                        </div>
                    </button>
                    <button
                        onClick={() => setFilter("approved")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Approved ({approvedCount})
                        </div>
                    </button>
                    <button
                        onClick={() => setFilter("rejected")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected ({rejectedCount})
                        </div>
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "all"
                                ? "bg-smart-teal text-smart-charcoal"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        All ({memberships.length})
                    </button>
                </div>

                {/* Memberships List */}
                {loading ? (
                    <div className="grid gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-48 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredMemberships.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No {filter !== "all" ? filter : ""} requests
                        </h3>
                        <p className="text-gray-500">
                            {filter === "pending"
                                ? "All caught up! No pending requests at the moment."
                                : `No ${filter} membership requests found.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredMemberships.map((membership) => (
                            <div
                                key={membership._id}
                                className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-smart-teal dark:hover:border-smart-teal transition-all"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-smart-teal/10 flex items-center justify-center">
                                                <User className="w-6 h-6 text-smart-teal" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                                    {membership.userName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Mail className="w-4 h-4" />
                                                    {membership.userEmail}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pass Info */}
                                        <div className="pl-15">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-smart-amber" />
                                                <span className="text-sm font-bold text-gray-700 dark:text-smart-silver/80">
                                                    Requesting access to:
                                                </span>
                                            </div>
                                            <p className="text-xl font-black text-gray-900 dark:text-white">
                                                {membership.passName}
                                            </p>
                                        </div>

                                        {/* Request Date */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            Requested on{" "}
                                            {new Date(membership.requestedAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>

                                        {/* Status Badge */}
                                        <div>
                                            {membership.status === "pending" && (
                                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                    Pending Review
                                                </Badge>
                                            )}
                                            {membership.status === "approved" && (
                                                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                                    Approved on{" "}
                                                    {membership.approvedAt &&
                                                        new Date(membership.approvedAt).toLocaleDateString()}
                                                </Badge>
                                            )}
                                            {membership.status === "rejected" && (
                                                <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                                    Rejected on{" "}
                                                    {membership.rejectedAt &&
                                                        new Date(membership.rejectedAt).toLocaleDateString()}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {membership.status === "pending" && (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => handleApprove(membership._id)}
                                                disabled={processing === membership._id}
                                                className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 font-bold"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {processing === membership._id ? "Processing..." : "Approve"}
                                            </Button>
                                            <Button
                                                onClick={() => handleReject(membership._id)}
                                                disabled={processing === membership._id}
                                                variant="outline"
                                                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl px-6 font-bold"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
