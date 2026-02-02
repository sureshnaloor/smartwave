"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminPass } from "@/lib/admin/pass";
import { ArrowLeft, Share2, MapPin, Calendar, Clock, User, Bell, Check, Users } from "lucide-react";

type Pass = Omit<AdminPass, "_id" | "dateStart" | "dateEnd"> & {
    _id: string;
    dateStart?: string;
    dateEnd?: string;
};

export default function PassDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [pass, setPass] = useState<Pass | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.id) return;

        fetch(`/api/passes/${params.id}`)
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Pass not found");
                    throw new Error("Failed to fetch pass");
                }
                return res.json();
            })
            .then((data) => {
                setPass(data.pass);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">Loading pass details...</div>;
    }

    if (error || !pass) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Pass Unavailable</h1>
                <p className="text-zinc-400 mb-8">{error || "This pass does not exist or has been removed."}</p>
                <Link href="/passes" className="bg-white text-black px-6 py-3 rounded-full font-semibold">
                    Back to All Passes
                </Link>
            </div>
        );
    }

    const startDate = pass.dateStart ? new Date(pass.dateStart) : null;
    const formattedDate = startDate ? startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : "Dates to be announced";
    const formattedTime = startDate ? startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : "";

    return (
        <div className="min-h-screen bg-black text-white font-sans max-w-md mx-auto relative border-x border-zinc-900">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-zinc-800">
                <button onClick={() => router.back()} className="flex items-center text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6 mr-1" /> Back
                </button>
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center">
                    Share <Share2 className="w-5 h-5 ml-1" />
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Pass Preview Card */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl opacity-70 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative aspect-[3/4.5] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col shadow-2xl">
                        {/* Event Header Image Area (Gradient Placeholder) */}
                        <div className="h-1/3 bg-gradient-to-b from-blue-900/50 to-zinc-900 flex items-center justify-center p-6 text-center">
                            <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                {pass.name.toUpperCase()}
                            </h2>
                        </div>

                        {/* Cutouts for "Ticket" look */}
                        <div className="relative h-4 bg-zinc-900">
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div>
                            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-zinc-800"></div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Location</p>
                                    <div className="flex items-start text-zinc-200">
                                        <MapPin className="w-5 h-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                                        <span className="font-medium text-lg">{pass.location?.name || "Location TBD"}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Date & Time</p>
                                    <div className="flex items-start text-zinc-200">
                                        <Calendar className="w-5 h-5 mr-2 text-purple-500 shrink-0 mt-0.5" />
                                        <span className="font-medium text-lg">{formattedDate}</span>
                                    </div>
                                    {formattedTime && (
                                        <div className="flex items-center text-zinc-400 ml-7">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>{formattedTime}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Pass Holder</p>
                                    <div className="flex items-center text-zinc-200">
                                        <User className="w-5 h-5 mr-2 text-zinc-500" />
                                        <span className="font-medium">Guest User</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <p className="text-xs text-center text-zinc-600 font-mono mb-2">#{pass._id.slice(-8).toUpperCase()}</p>
                                {/* Placeholder Barcode */}
                                <div className="h-12 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                                    <div className="w-full h-full bg-[url('/barcode-pattern.png')] bg-repeat-x opacity-50"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wallet Status */}
                <a href={`/api/wallet/apple?passId=${pass._id}`} target="_blank" className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                            <Check className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-white">Add to Apple Wallet</p>
                            <p className="text-xs text-zinc-400">Tap to download</p>
                        </div>
                    </div>
                </a>

                {/* Notifications */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <h3 className="flex items-center font-bold text-zinc-200 mb-4">
                        <Bell className="w-5 h-5 mr-2" /> Notifications
                    </h3>
                    <div className="space-y-3">
                        {['2 hours before event', 'When I arrive', '30 min before doors'].map((label, i) => (
                            <label key={i} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors">
                                <div className="w-5 h-5 rounded border border-zinc-600 flex items-center justify-center">
                                    {/* Mock toggle */}
                                </div>
                                <span className="text-zinc-400 text-sm">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Event Details Text */}
                <div className="space-y-4">
                    <h3 className="font-bold text-xl">Event Details</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        {pass.description || "No description provided."}
                    </p>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Doors open: 1 hour prior</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Show starts: {formattedTime}</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Parking: Available on-site</li>
                    </ul>
                </div>

                {/* Going With */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                    <h3 className="flex items-center font-bold text-zinc-200 mb-4">
                        <Users className="w-5 h-5 mr-2" /> Going with
                    </h3>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-zinc-700 border-2 border-black flex items-center justify-center text-xs font-bold text-zinc-400">
                                {['S', 'M', 'J'][i - 1]}
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs font-bold text-zinc-400">
                            +3
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
