"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AdminPass } from "@/lib/admin/pass"; // Interface only
import {
    Search, MapPin, Calendar, Clock, Bell, User, QrCode, Users,
    Ticket, Building2, ShoppingBag, Music, PartyPopper, Briefcase,
    ChevronRight, CreditCard, Wallet, Church, Heart, UsersRound, Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Pass = Omit<AdminPass, "_id" | "createdByAdminId" | "createdAt" | "updatedAt" | "dateStart" | "dateEnd"> & {
    _id: string;
    createdByAdminId: string;
    createdAt: string;
    updatedAt: string;
    dateStart?: string;
    dateEnd?: string;
    membershipStatus?: "pending" | "approved" | "rejected" | null;
    membershipId?: string | null;
    pendingMembershipsCount?: number;
};

type CategoryType = "all" | "concerts" | "workplace" | "events" | "retail" | "access" | "community" | "temples" | "spiritual";


export default function PassesPage() {
    const router = useRouter();
    const { status } = useSession();
    const [publicPasses, setPublicPasses] = useState<Pass[]>([]);
    const [corporatePasses, setCorporatePasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'public' | 'corporate' | 'my-passes'>('public');
    const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
    const [isEmployee, setIsEmployee] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
    const [requestLoading, setRequestLoading] = useState(false);
    const [isPublicAdmin, setIsPublicAdmin] = useState(false);
    const [myPasses, setMyPasses] = useState<Pass[]>([]);
    const [userRole, setUserRole] = useState<string>("user");

    // Protection check
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/passes");
        }
    }, [status, router]);

    // Get user's location
    useEffect(() => {
        if (status !== "authenticated") return;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationEnabled(true);
                },
                (error) => {
                    console.log("Location access denied or unavailable", error);
                    setLocationEnabled(false);
                }
            );
        }
    }, [status]);

    // Fetch passes with filters
    useEffect(() => {
        if (status !== "authenticated") return;
        const params = new URLSearchParams();
        // ... fetch logic ...
        if (activeCategory !== "all") {
            params.append("category", activeCategory);
        }
        if (locationEnabled && userLocation) {
            params.append("lat", userLocation.lat.toString());
            params.append("lng", userLocation.lng.toString());
            params.append("radius", "20"); // 20km radius
        }

        const url = `/api/passes${params.toString() ? `?${params.toString()}` : ""}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setPublicPasses(data.passes || []);
                setCorporatePasses(data.corporate || []);
                setIsEmployee(!!data.isEmployee);
                setIsPublicAdmin(!!data.isPublicAdmin);

                // Auto-switch to corporate tab for employees
                if (data.isEmployee && data.corporate && data.corporate.length > 0) {
                    setActiveTab('corporate');
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));

        // Fetch request status
        fetch("/api/user/public-admin-request")
            .then(res => res.json())
            .then(data => {
                setRequestStatus(data.status || "none");
            })
            .catch(() => { });
    }, [activeCategory, locationEnabled, userLocation, status]);

    // Fetch my passes when isPublicAdmin changes
    useEffect(() => {
        if (isPublicAdmin) {
            fetch("/api/admin/passes")
                .then(res => res.json())
                .then(data => {
                    setMyPasses(data.passes || []);
                })
                .catch(() => { });
        }
    }, [isPublicAdmin]);

    const handleRequestAdmin = async () => {
        setRequestLoading(true);
        try {
            const res = await fetch("/api/user/public-admin-request", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setRequestStatus("pending");
            } else {
                alert(data.error || "Failed to submit request");
            }
        } catch {
            alert("Network error");
        } finally {
            setRequestLoading(false);
        }
    };

    const currentPassesView = activeTab === 'public' ? publicPasses : (activeTab === 'corporate' ? corporatePasses : myPasses);

    const filteredView = currentPassesView.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const upcomingPasses = filteredView.filter(p => p.type === 'event').sort((a, b) => {
        const da = a.dateStart ? new Date(a.dateStart).getTime() : 0;
        const db = b.dateStart ? new Date(b.dateStart).getTime() : 0;
        return da - db;
    });

    const accessPasses = filteredView.filter(p => p.type === 'access');

    const categories = [
        { icon: Ticket, label: "All Passes", value: "all" as CategoryType },
        { icon: Music, label: "Concerts", value: "concerts" as CategoryType },
        { icon: Briefcase, label: "Workplace", value: "workplace" as CategoryType },
        { icon: PartyPopper, label: "Events", value: "events" as CategoryType },
        { icon: ShoppingBag, label: "Retail", value: "retail" as CategoryType },
        { icon: Building2, label: "Access", value: "access" as CategoryType },
        { icon: UsersRound, label: "Community", value: "community" as CategoryType },
        { icon: Church, label: "Temples", value: "temples" as CategoryType },
        { icon: Heart, label: "Spiritual", value: "spiritual" as CategoryType },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="container mx-auto px-6 py-12 space-y-16">
                {/* Hero / Welcome Section */}
                <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-white dark:from-smart-charcoal/30 dark:to-black border border-gray-200 dark:border-white/10 p-8 md:p-16 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-smart-teal/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-smart-amber/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                                Discover your <br />
                                <span className="text-gradient">Digital Passes</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-smart-silver/80 mb-8 leading-relaxed">
                                Access events, office buildings, and organization memberships in one place. Add them to your Apple Wallet or Google Pay with a single tap.
                            </p>
                            {locationEnabled && (
                                <div className="mb-4 flex items-center gap-2 text-sm text-smart-teal">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-semibold">Showing passes within 20km of your location</span>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal rounded-full px-8 py-6 text-base font-bold transition-all hover:scale-105">
                                    <Ticket className="w-5 h-5 mr-2" /> Explore Events
                                </Button>
                                <Button variant="outline" className="border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full px-8 py-6 text-base font-bold transition-all text-gray-900 dark:text-white">
                                    <Wallet className="w-5 h-5 mr-2" /> My Wallet
                                </Button>
                                {requestStatus === "none" && !isEmployee && (
                                    <Button
                                        onClick={handleRequestAdmin}
                                        disabled={requestLoading}
                                        className="bg-smart-teal/20 hover:bg-smart-teal/30 text-smart-teal border border-smart-teal/50 rounded-full px-8 py-6 text-base font-bold transition-all"
                                    >
                                        {requestLoading ? "Submitting..." : "Request Admin Access"}
                                    </Button>
                                )}
                                {requestStatus === "pending" && (
                                    <Badge variant="outline" className="border-amber-500 text-amber-500 px-6 py-4 rounded-full text-sm font-bold">
                                        Admin Request Pending
                                    </Badge>
                                )}
                                {requestStatus === "rejected" && (
                                    <Badge variant="outline" className="border-red-500 text-red-500 px-6 py-4 rounded-full text-sm font-bold">
                                        Admin Request Rejected
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:flex justify-center">
                            <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl py-4 px-6 w-full max-w-sm shadow-inner group focus-within:ring-2 focus-within:ring-smart-teal/50 transition-all">
                                <Search className="w-5 h-5 text-gray-400 mr-3 group-hover:text-smart-teal transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search passes..."
                                    className="bg-transparent border-none outline-none text-lg w-full placeholder:text-gray-400 text-gray-900 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* Tabs Section */}
                {(isEmployee || isPublicAdmin || corporatePasses.length > 0) && (
                    <section className="border-b border-gray-100 dark:border-white/10">
                        <div className="flex gap-12 overflow-x-auto pb-0 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('corporate')}
                                className={`pb-6 text-xl font-bold transition-all relative whitespace-nowrap ${activeTab === 'corporate' ? 'text-smart-teal' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <Building2 className="w-6 h-6" />
                                    Corporate Passes
                                </span>
                                {activeTab === 'corporate' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-smart-teal rounded-full shadow-[0_0_15px_rgba(0,212,170,0.5)]"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('public')}
                                className={`pb-6 text-xl font-bold transition-all relative whitespace-nowrap ${activeTab === 'public' ? 'text-smart-teal' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <Ticket className="w-6 h-6" />
                                    Public Events
                                </span>
                                {activeTab === 'public' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-smart-teal rounded-full shadow-[0_0_15px_rgba(0,212,170,0.5)]"></div>
                                )}
                            </button>
                            {isPublicAdmin && (
                                <button
                                    onClick={() => setActiveTab('my-passes')}
                                    className={`pb-6 text-xl font-bold transition-all relative whitespace-nowrap ${activeTab === 'my-passes' ? 'text-smart-teal' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Users className="w-6 h-6" />
                                        My Created Passes
                                    </span>
                                    {activeTab === 'my-passes' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-smart-teal rounded-full shadow-[0_0_15px_rgba(0,212,170,0.5)]"></div>
                                    )}
                                </button>
                            )}
                        </div>
                    </section>
                )}


                {/* Categories - Only show for Public tab or if user is not corporate employee */}
                {(activeTab === 'public' || !isEmployee) && (
                    <section>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {categories.map((cat, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={`
                                        flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all whitespace-nowrap text-sm font-semibold
                                        ${activeCategory === cat.value
                                            ? 'bg-smart-teal text-smart-charcoal border-smart-teal shadow-lg'
                                            : 'bg-transparent text-gray-500 border-gray-200 dark:border-white/10 hover:border-smart-teal hover:text-smart-teal dark:text-smart-silver/60'
                                        }
                                    `}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}


                {/* Upcoming Events Grid */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between border-gray-100 dark:border-white/10 pb-4">
                        <h2 className="text-3xl font-black flex items-center gap-4 text-gray-900 dark:text-white uppercase tracking-tight">
                            <span className="w-1.5 h-8 bg-smart-teal rounded-full shadow-[0_0_15px_rgba(0,212,170,0.5)]"></span>
                            {activeTab === 'corporate' ? 'Corporate Events' : activeTab === 'my-passes' ? 'My Events' : 'Upcoming Events'}
                        </h2>
                        {activeTab === 'my-passes' ? (
                            <div className="flex items-center gap-4">
                                <Link href="/admin/passes/memberships" className="flex items-center px-6 py-2 bg-smart-amber text-smart-charcoal rounded-full text-sm font-bold hover:scale-105 transition-all">
                                    <Users className="w-4 h-4 mr-2" /> Manage Requests
                                </Link>
                                <Link href="/admin/passes/create" className="flex items-center px-6 py-2 bg-smart-teal text-smart-charcoal rounded-full text-sm font-bold hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4 mr-2" /> Create New Pass
                                </Link>
                            </div>
                        ) : (
                            <Link href="#" className="hidden md:flex items-center text-sm font-bold text-smart-teal hover:underline transition-all">
                                View all <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-[450px] bg-gray-50 dark:bg-white/5 rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/10"></div>
                            ))
                        ) : upcomingPasses.length > 0 ? (
                            upcomingPasses.map(pass => (
                                <PassCard key={pass._id} pass={pass} showEdit={activeTab === 'my-passes'} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/[0.02]">
                                <Calendar className="w-12 h-12 mb-4 text-gray-300 dark:text-white/10" />
                                <p className="text-xl font-medium">
                                    {activeTab === 'corporate' ? 'No corporate events found.' : 'No upcoming events found.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Access Passes */}
                <section className="space-y-10">
                    <div className="flex items-center justify-between border-gray-100 dark:border-white/10 pb-4">
                        <h2 className="text-3xl font-black flex items-center gap-4 text-gray-900 dark:text-white uppercase tracking-tight">
                            <span className="w-1.5 h-8 bg-smart-amber rounded-full shadow-[0_0_15px_rgba(255,191,0,0.5)]"></span>
                            {activeTab === 'corporate' ? 'Corporate Access' : 'Access & Memberships'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-56 bg-gray-50 dark:bg-white/5 rounded-[2rem] animate-pulse border border-gray-100 dark:border-white/10"></div>
                            ))
                        ) : accessPasses.length > 0 ? (
                            accessPasses.map(pass => (
                                <AccessCard key={pass._id} pass={pass} showEdit={activeTab === 'my-passes'} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/[0.02]">
                                <CreditCard className="w-12 h-12 mb-4 text-gray-300 dark:text-white/10" />
                                <p className="text-xl font-medium">No access passes found.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function PassCard({ pass, showEdit }: { pass: Pass, showEdit?: boolean }) {
    const formattedDate = pass.dateStart ? new Date(pass.dateStart).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
    }) : "Date TBA";

    const getMembershipBadge = () => {
        if (!pass.membershipStatus) return null;

        const badges = {
            pending: { text: "Pending Approval", color: "bg-amber-500/90" },
            approved: { text: "Approved", color: "bg-green-500/90" },
            rejected: { text: "Rejected", color: "bg-red-500/90" },
        };

        const badge = badges[pass.membershipStatus];
        return (
            <div className={`${badge.color} backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/20`}>
                {badge.text}
            </div>
        );
    };

    return (
        <Link href={`/passes/${pass._id}`} className="group block h-full">
            <div className="h-full bg-white dark:bg-smart-charcoal/20 border border-gray-100 dark:border-white/10 group-hover:border-smart-teal group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col relative">
                {/* Image Placeholder */}
                <div className="h-56 bg-gray-50 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-smart-teal/0 group-hover:bg-smart-teal/5 transition-colors duration-500"></div>

                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                        {showEdit && (pass.pendingMembershipsCount || 0) > 0 && (
                            <Link
                                href="/admin/passes/memberships"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-red-500 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/20 animate-pulse z-10"
                            >
                                {pass.pendingMembershipsCount} REQUESTS
                            </Link>
                        )}
                        {pass.status === 'draft' && (
                            <div className="bg-smart-amber/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-smart-charcoal border border-white/20">
                                DRAFT
                            </div>
                        )}
                        {getMembershipBadge()}
                        <div className="bg-smart-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/10 uppercase tracking-widest">
                            {pass.type}
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 scale-150 group-hover:scale-110">
                        <Ticket className="w-32 h-32 text-smart-teal" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-black uppercase tracking-widest flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-smart-teal" /> {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-smart-teal transition-colors duration-300">
                            {pass.name}
                        </h3>
                        {pass.location?.name && (
                            <p className="text-sm text-gray-500 dark:text-smart-silver/60 flex items-center font-medium">
                                <MapPin className="w-4 h-4 mr-2 text-smart-teal/50" />
                                <span className="line-clamp-1">{pass.location.name}</span>
                            </p>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                        {showEdit ? (
                            <Link
                                href={`/admin/passes/${pass._id}/edit`}
                                className="text-xs font-black uppercase tracking-widest text-smart-teal hover:underline z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Edit Settings
                            </Link>
                        ) : (
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-smart-teal transition-colors">
                                {pass.membershipStatus === 'approved' ? 'View Pass' : 'Get Pass'}
                            </span>
                        )}
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-smart-teal transition-all duration-300 transform group-hover:translate-x-1">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-white group-hover:text-smart-charcoal" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function AccessCard({ pass, showEdit }: { pass: Pass, showEdit?: boolean }) {
    return (
        <Link href={`/passes/${pass._id}`} className="group block">
            <div className="bg-white dark:bg-smart-charcoal/20 border border-gray-100 dark:border-white/10 hover:border-smart-amber hover:bg-gray-50 dark:hover:bg-white/5 rounded-[2rem] p-8 transition-all duration-500 flex items-start gap-6 relative overflow-hidden group/card shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-smart-amber/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/card:bg-smart-amber/10 transition-colors"></div>

                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover/card:bg-smart-amber group-hover/card:border-smart-amber transition-all duration-500 shadow-inner">
                    <Building2 className="w-10 h-10 text-gray-400 dark:text-smart-silver/40 group-hover/card:text-smart-charcoal transition-colors" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-smart-silver/60 uppercase tracking-widest border border-gray-200 dark:border-white/10">
                            {pass.type}
                        </span>
                        {pass.status === 'draft' && (
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-smart-amber/20 text-smart-amber uppercase tracking-widest border border-smart-amber/30">
                                DRAFT
                            </span>
                        )}
                        {showEdit && (
                            <Link
                                href={`/admin/passes/${pass._id}/edit`}
                                className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-smart-teal/20 text-smart-teal uppercase tracking-widest border border-smart-teal/30 hover:bg-smart-teal/30 z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Edit
                            </Link>
                        )}
                        {showEdit && (pass.pendingMembershipsCount || 0) > 0 && (
                            <Link
                                href="/admin/passes/memberships"
                                className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-red-500 text-white uppercase tracking-widest border border-red-600 animate-pulse z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {pass.pendingMembershipsCount} Requests
                            </Link>
                        )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover/card:text-smart-amber transition-colors mb-3 leading-tight">
                        {pass.name}
                    </h3>
                    <p className="text-gray-500 dark:text-smart-silver/60 line-clamp-2 mb-6 font-medium leading-relaxed">
                        {pass.description || "Secure corporate access membership details."}
                    </p>

                    <div className="flex items-center text-xs font-black uppercase tracking-widest">
                        <div className={`w-2.5 h-2.5 rounded-full mr-3 animate-pulse shadow-glow ${pass.status === 'draft' ? 'bg-smart-amber shadow-smart-amber/50' : 'bg-green-500 shadow-green-500/50'}`}></div>
                        <span className={pass.status === 'draft' ? 'text-smart-amber' : 'text-green-500'}>
                            {pass.status === 'draft' ? 'Draft' : 'Active'}
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-4 group-hover/card:translate-x-0">
                    <ChevronRight className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
            </div>
        </Link>
    );
}
