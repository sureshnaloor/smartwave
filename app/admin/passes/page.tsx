"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Plus, Ticket, Calendar, MapPin, Edit, Eye,
    Trash2, Users, CheckCircle, Clock, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Pass {
    _id: string;
    name: string;
    description?: string;
    type: "event" | "access";
    category?: string;
    location?: {
        name: string;
        lat?: number;
        lng?: number;
        address?: string;
    };
    dateStart?: string;
    dateEnd?: string;
    status: "draft" | "active";
    createdAt: string;
}

export default function AdminPassesPage() {
    const router = useRouter();
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "draft" | "active">("all");

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const res = await fetch("/api/admin/passes");
            const data = await res.json();
            setPasses(data.passes || []);
        } catch (error) {
            console.error("Failed to fetch passes:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPasses = passes.filter((pass) => {
        if (filter === "all") return true;
        return pass.status === filter;
    });

    const draftCount = passes.filter((p) => p.status === "draft").length;
    const activeCount = passes.filter((p) => p.status === "active").length;

    return (
        <div className="min-h-screen bg-white dark:bg-black py-12">
            <div className="container mx-auto px-6 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            My Passes
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-smart-silver/80">
                            Create and manage your passes for events, access, and memberships
                        </p>
                    </div>
                    <Link href="/admin/passes/create">
                        <Button className="bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal h-12 px-6 rounded-xl font-black">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Pass
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-smart-teal/10 to-smart-teal/5 border border-smart-teal/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-600 dark:text-smart-silver/60 uppercase tracking-wider">
                                    Total Passes
                                </p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                                    {passes.length}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-smart-teal/20 flex items-center justify-center">
                                <Ticket className="w-7 h-7 text-smart-teal" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-600 dark:text-smart-silver/60 uppercase tracking-wider">
                                    Draft
                                </p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                                    {draftCount}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-gray-600 dark:text-smart-silver/60 uppercase tracking-wider">
                                    Active
                                </p>
                                <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                                    {activeCount}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "all"
                                ? "bg-smart-teal text-smart-charcoal"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        All ({passes.length})
                    </button>
                    <button
                        onClick={() => setFilter("draft")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "draft"
                                ? "bg-amber-500 text-white"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        Draft ({draftCount})
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${filter === "active"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-smart-silver/60 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                    >
                        Active ({activeCount})
                    </button>
                </div>

                {/* Passes List */}
                {loading ? (
                    <div className="grid gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-48 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredPasses.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No {filter !== "all" ? filter : ""} passes found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter === "all"
                                ? "Get started by creating your first pass"
                                : `No ${filter} passes at the moment`}
                        </p>
                        {filter === "all" && (
                            <Link href="/admin/passes/create">
                                <Button className="bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Pass
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredPasses.map((pass) => (
                            <div
                                key={pass._id}
                                className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-smart-teal dark:hover:border-smart-teal transition-all group"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-smart-teal/10 flex items-center justify-center flex-shrink-0">
                                                <Ticket className="w-6 h-6 text-smart-teal" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex-1">
                                                        {pass.name}
                                                    </h3>
                                                    <div className="flex gap-2">
                                                        <Badge
                                                            className={
                                                                pass.status === "active"
                                                                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                                                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                            }
                                                        >
                                                            {pass.status}
                                                        </Badge>
                                                        <Badge className="bg-smart-teal/10 text-smart-teal border border-smart-teal/20">
                                                            {pass.type}
                                                        </Badge>
                                                        {pass.category && pass.category !== "all" && (
                                                            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                                                {pass.category}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                {pass.description && (
                                                    <p className="text-sm text-gray-600 dark:text-smart-silver/80 line-clamp-2">
                                                        {pass.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-wrap gap-6 text-sm">
                                            {pass.dateStart && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-smart-silver/80">
                                                    <Calendar className="w-4 h-4 text-smart-amber" />
                                                    {new Date(pass.dateStart).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            )}
                                            {pass.location?.name && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-smart-silver/80">
                                                    <MapPin className="w-4 h-4 text-green-500" />
                                                    {pass.location.name}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                Created {new Date(pass.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Address if available */}
                                        {pass.location?.address && (
                                            <div className="p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                                <p className="text-xs text-gray-500 font-medium">
                                                    📍 {pass.location.address}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/passes/${pass._id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/passes/${pass._id}/edit`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Links */}
                <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-black mb-4">Quick Links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link
                            href="/admin/passes/memberships"
                            className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-smart-teal transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-smart-teal/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-smart-teal" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-smart-teal transition-colors">
                                        Membership Requests
                                    </p>
                                    <p className="text-xs text-gray-500">Review and approve join requests</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
