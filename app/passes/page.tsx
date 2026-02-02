"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPass } from "@/lib/admin/pass"; // Interface only
import {
    Search, MapPin, Calendar, Clock, Bell, User, QrCode, Users,
    Ticket, Building2, ShoppingBag, Music, PartyPopper, Briefcase,
    ChevronRight, CreditCard, Wallet
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
};


export default function PassesPage() {
    const [publicPasses, setPublicPasses] = useState<Pass[]>([]);
    const [corporatePasses, setCorporatePasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'public' | 'corporate'>('public');
    const [isEmployee, setIsEmployee] = useState(false);

    useEffect(() => {
        fetch("/api/passes")
            .then((res) => res.json())
            .then((data) => {
                setPublicPasses(data.passes || []);
                setCorporatePasses(data.corporate || []);
                setIsEmployee(!!data.isEmployee);

                // If they are an employee, default to corporate tab
                if (data.isEmployee) {
                    setActiveTab('corporate');
                } else if (data.corporate && data.corporate.length > 0) {
                    setActiveTab('corporate');
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const currentPasses = activeTab === 'public' ? publicPasses : corporatePasses;

    const filteredPasses = currentPasses.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const upcomingPasses = filteredPasses.filter(p => p.type === 'event').sort((a, b) => {
        const da = a.dateStart ? new Date(a.dateStart).getTime() : 0;
        const db = b.dateStart ? new Date(b.dateStart).getTime() : 0;
        return da - db;
    });

    const accessPasses = filteredPasses.filter(p => p.type === 'access');

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg shadow-purple-900/20">
                            <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                                <span className="font-bold text-lg bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">W</span>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight">WavePass</span>
                    </div>

                    <div className="hidden md:flex items-center bg-zinc-900/50 border border-zinc-800 rounded-full py-2 px-4 w-96 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                        <Search className="w-4 h-4 text-zinc-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search events, locations, passes..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 text-zinc-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center">
                            <User className="w-5 h-5 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 space-y-16">
                {/* Hero / Welcome Section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-black border border-white/10 p-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-6">
                            Discover & Manage Your Digital Passes
                        </h1>
                        <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                            Access your events, office buildings, and exclusive memberships all in one place. Add them to your Apple Wallet with a single tap.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 py-6 text-base font-semibold">
                                Explore Events
                            </Button>
                            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900 hover:text-white rounded-full px-8 py-6 text-base font-semibold">
                                <Wallet className="w-4 h-4 mr-2" /> My Wallet
                            </Button>
                        </div>
                    </div>
                </section>


                {/* Tabs Section */}
                {(isEmployee || corporatePasses.length > 0) && (
                    <section className="border-b border-zinc-900">
                        <div className="flex gap-8 overflow-x-auto pb-0 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('corporate')}
                                className={`pb-4 text-lg font-bold transition-all relative whitespace-nowrap ${activeTab === 'corporate' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Corporate Passes
                                </span>
                                {activeTab === 'corporate' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('public')}
                                className={`pb-4 text-lg font-bold transition-all relative whitespace-nowrap ${activeTab === 'public' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <Ticket className="w-5 h-5" />
                                    Public Events
                                </span>
                                {activeTab === 'public' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                )}
                            </button>
                        </div>
                    </section>
                )}

                {/* Categories - Only show for Public tab or if user is not corporate employee */}
                {(activeTab === 'public' || !isEmployee) && (
                    <section>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {[
                                { icon: Ticket, label: "All Passes" },
                                { icon: Music, label: "Concerts" },
                                { icon: Briefcase, label: "Workplace" },
                                { icon: PartyPopper, label: "Events" },
                                { icon: ShoppingBag, label: "Retail" },
                                { icon: Building2, label: "Access" },
                            ].map((cat, i) => (
                                <button key={i} className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all whitespace-nowrap ${i === 0 ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'}`}>
                                    <cat.icon className="w-4 h-4" />
                                    <span className="font-medium text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}


                {/* Upcoming Events Grid */}
                <section className="space-y-8">
                    <div className="flex items-end justify-between border-b border-zinc-900 pb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-blue-500" />
                            {activeTab === 'corporate' ? 'Corporate Events' : 'Upcoming Events'}
                        </h2>
                        <Link href="#" className="hidden md:flex items-center text-sm text-zinc-500 hover:text-white transition-colors">
                            View all <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-[400px] bg-zinc-900/50 rounded-2xl animate-pulse"></div>
                            ))
                        ) : upcomingPasses.length > 0 ? (
                            upcomingPasses.map(pass => (
                                <PassCard key={pass._id} pass={pass} />
                            ))
                        ) : (
                            <div className="col-span-full h-40 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                                {activeTab === 'corporate' ? 'No corporate events found.' : 'No upcoming events found.'}
                            </div>
                        )}
                    </div>
                </section>

                {/* Access Passes */}
                <section className="space-y-8">
                    <div className="flex items-end justify-between border-b border-zinc-900 pb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-purple-500" />
                            {activeTab === 'corporate' ? 'Corporate Access & Memberships' : 'Access & Memberships'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse"></div>
                            ))
                        ) : accessPasses.length > 0 ? (
                            accessPasses.map(pass => (
                                <AccessCard key={pass._id} pass={pass} />
                            ))
                        ) : (
                            <div className="col-span-full h-40 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                                No access passes found.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

function PassCard({ pass }: { pass: Pass }) {
    const formattedDate = pass.dateStart ? new Date(pass.dateStart).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric'
    }) : "Date TBA";

    return (
        <Link href={`/passes/${pass._id}`} className="group block h-full">
            <div className="h-full bg-zinc-900 border border-zinc-800 group-hover:border-zinc-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        {pass.status === 'draft' && (
                            <div className="bg-amber-500/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white border border-amber-400/50">
                                DRAFT
                            </div>
                        )}
                        <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 uppercase">
                            {pass.type}
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5" /> {formattedDate}
                        </p>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                            {pass.name}
                        </h3>
                        {pass.location?.name && (
                            <p className="text-sm text-zinc-400 flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                                <span className="line-clamp-1">{pass.location.name}</span>
                            </p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Get Pass</span>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function AccessCard({ pass }: { pass: Pass }) {
    return (
        <Link href={`/passes/${pass._id}`} className="group block">
            <div className="bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 mb-2 border border-zinc-700">
                        {pass.type.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                        {pass.name}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                        {pass.description || "Corporate access details."}
                    </p>
                    <div className="flex items-center text-xs text-zinc-500">
                        {pass.status === 'draft' ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span> Draft status
                            </>
                        ) : (
                            <>
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Active status
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
