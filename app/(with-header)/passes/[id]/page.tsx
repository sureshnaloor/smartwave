"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar, MapPin, Clock, ArrowLeft, Ticket,
    Share2, ShieldCheck, Zap, Globe, Building2,
    CalendarCheck, Bell, ChevronRight, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Navigation, Map as MapIcon, Compass } from "lucide-react";

interface Pass {
    _id: string;
    name: string;
    description?: string;
    type: "event" | "access";
    location?: {
        name: string;
        lat?: number;
        lng?: number;
    };
    dateStart?: string;
    dateEnd?: string;
    status: "draft" | "active";
}

export default function PassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [pass, setPass] = useState<Pass | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [os, setOs] = useState<"ios" | "android" | "other">("other");

    useEffect(() => {
        if (!params.id) return;

        // Simple OS detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setOs("ios");
        } else if (/android/.test(userAgent)) {
            setOs("android");
        }

        fetch(`/api/passes/${params.id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Failed to fetch pass");
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
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-smart-teal border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !pass) {
        return (
            <div className="min-h-screen bg-white dark:bg-black py-24">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl font-black mb-4">Pass not found</h1>
                    <p className="text-gray-500 mb-8">{error || "The requested pass does not exist or you do not have permission to view it."}</p>
                    <Button onClick={() => router.push("/passes")} className="bg-smart-teal text-smart-charcoal rounded-full px-8 overflow-hidden hover:scale-105 transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Passes
                    </Button>
                </div>
            </div>
        );
    }

    const startDate = pass.dateStart ? new Date(pass.dateStart) : null;
    const formattedDate = startDate ? startDate.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : "Date TBA";
    const formattedTime = startDate ? startDate.toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit'
    }) : "Time TBA";

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-24">
            {/* Header / Nav Area */}
            <div className="container mx-auto px-6 pt-12 mb-8">
                <Link
                    href="/passes"
                    className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-smart-teal transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Feed
                </Link>
            </div>

            <main className="container mx-auto px-6 grid lg:grid-cols-12 gap-12">
                {/* Left Column: Visual & Info */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Pass Visual Card */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-[3rem] bg-snow-light dark:bg-gradient-to-br dark:from-smart-charcoal dark:to-black border border-gray-200 dark:border-white/10 shadow-2xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center p-12 text-center"
                    >
                        {/* Decor */}
                        <div className="absolute inset-0 bg-smart-teal/5 opacity-50 dark:opacity-50"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-smart-teal/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-smart-amber/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10px] sm:text-xs font-black tracking-widest text-smart-charcoal dark:text-white uppercase mb-8 shadow-sm">
                                <Ticket className="w-3.5 h-3.5 text-smart-teal" /> {pass.type} Pass
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-smart-charcoal dark:text-white mb-6 uppercase tracking-tight leading-none">
                                {pass.name}
                            </h1>
                            {pass.status === "draft" && (
                                <Badge className="bg-smart-amber text-smart-charcoal hover:bg-smart-amber font-black py-1.5 px-5 text-xs rounded-full shadow-lg border-2 border-white/20">
                                    DRAFT PREVIEW
                                </Badge>
                            )}
                        </div>
                    </motion.section>

                    {/* Pass Details */}
                    <section className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-smart-teal">
                                    <CalendarCheck className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Date & Time</h3>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formattedDate}</p>
                                    <p className="text-gray-500 font-medium">Starts at {formattedTime}</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-smart-amber">
                                    <MapPin className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Location</h3>
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{pass.location?.name || "Location TBA"}</p>
                                    <Button
                                        variant="link"
                                        className="text-sm font-bold text-smart-teal hover:underline p-0 h-auto"
                                        onClick={() => setIsLocationModalOpen(true)}
                                    >
                                        Open in Maps
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Location Modal */}
                        <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-smart-charcoal border-gray-200 dark:border-white/10 p-0 overflow-hidden rounded-[2rem]">
                                <DialogHeader className="p-8 pb-0">
                                    <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-smart-amber/10 flex items-center justify-center">
                                            <MapIcon className="w-5 h-5 text-smart-amber" />
                                        </div>
                                        Location Details
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="p-8">
                                    <Tabs defaultValue="map" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-8">
                                            <TabsTrigger value="map" className="rounded-lg font-bold data-[state=active]:bg-smart-teal data-[state=active]:text-smart-charcoal">
                                                <MapIcon className="w-4 h-4 mr-2" /> Map View
                                            </TabsTrigger>
                                            <TabsTrigger value="directions" className="rounded-lg font-bold data-[state=active]:bg-smart-teal data-[state=active]:text-smart-charcoal">
                                                <Navigation className="w-4 h-4 mr-2" /> Instructions
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="map" className="space-y-6">
                                            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 relative group bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                                {pass.location?.name ? (
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        style={{ border: 0 }}
                                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(pass.location.name)}${pass.location.lat && pass.location.lng ? `&center=${pass.location.lat},${pass.location.lng}` : ''}`}
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    <div className="text-center p-8">
                                                        <MapIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                        <p className="text-gray-500 font-bold">Location details coming soon</p>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-smart-teal/20 transition-colors rounded-2xl"></div>
                                            </div>

                                            <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                <div>
                                                    <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">Destination</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{pass.location?.name}</p>
                                                </div>
                                                <Button
                                                    className="bg-smart-teal text-smart-charcoal hover:bg-smart-teal/80 rounded-full font-black px-6"
                                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pass.location?.name || "")}`, "_blank")}
                                                >
                                                    <Navigation className="w-4 h-4 mr-2" /> Get Directions
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="directions" className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-smart-teal/10 flex items-center justify-center shrink-0">
                                                        <Compass className="w-5 h-5 text-smart-teal" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-sm uppercase tracking-tight">Navigation Info</h4>
                                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                            Follow the Google Maps link to start real-time GPS navigation from your current location. For corporate building access, proceed to the main reception.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 ml-4">Steps to reach</h4>
                                                    {[
                                                        "Enter the main gate and proceed to security",
                                                        "Provide your digital pass for scanning",
                                                        "Follow signage for SmartWave reception",
                                                        "Arrival at destination"
                                                    ].map((step, i) => (
                                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                                            <div className="w-8 h-8 rounded-full border-2 border-smart-teal/20 flex items-center justify-center text-xs font-black text-smart-teal group-hover:bg-smart-teal group-hover:text-smart-charcoal transition-all">
                                                                {i + 1}
                                                            </div>
                                                            <p className="text-sm font-bold text-gray-700 dark:text-smart-silver/80">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">About this pass</h2>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-smart-silver/80 leading-relaxed max-w-3xl">
                                {pass.description || "No detailed description available for this pass. Please check back later for more information."}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-32 space-y-8">
                        {/* Action Card */}
                        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-xl space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add to Wallet</h3>
                                <p className="text-sm text-gray-500 font-medium">Keep your pass handy on your mobile device for quick access.</p>
                            </div>

                            <div className="space-y-4">
                                {(os === "ios" || os === "other") && (
                                    <Button
                                        onClick={() => window.open(`/api/wallet/apple?passId=${pass._id}`, '_blank')}
                                        className="w-full bg-black text-white hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-16 rounded-2xl font-black text-lg shadow-lg group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-smart-teal/0 group-hover:bg-smart-teal/10 transition-colors"></div>
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                             Add to Apple Wallet
                                        </span>
                                    </Button>
                                )}

                                {(os === "android" || os === "other") && (
                                    <Button
                                        onClick={() => window.open(`/api/wallet/google?passId=${pass._id}`, '_blank')}
                                        className="w-full bg-white text-black border-2 border-gray-200 hover:bg-gray-50 h-16 rounded-2xl font-black text-lg shadow-lg group dark:bg-black dark:text-white dark:border-white/10 dark:hover:bg-white/5"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            <Globe className="w-5 h-5 text-smart-teal" /> Add to Google Pay
                                        </span>
                                    </Button>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-4">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-smart-teal/10 flex items-center justify-center group-hover:bg-smart-teal/20 transition-colors">
                                        <Share2 className="w-5 h-5 text-smart-teal" />
                                    </div>
                                    <span className="font-bold text-sm">Share this pass</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-smart-amber/10 flex items-center justify-center group-hover:bg-smart-amber/20 transition-colors">
                                        <ShieldCheck className="w-5 h-5 text-smart-amber" />
                                    </div>
                                    <span className="font-bold text-sm">Verified by SmartWave</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Box */}
                        <div className="p-6 rounded-[2rem] bg-smart-teal/5 border border-smart-teal/10 space-y-4">
                            <div className="flex items-center gap-3 text-smart-teal">
                                <Info className="w-5 h-5" />
                                <h4 className="font-black text-sm uppercase tracking-widest">Important Info</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-smart-silver/60 font-medium leading-relaxed">
                                This is a secure digital pass. Do not share your QR code or access links with unauthorized personnel. For assistance, contact your administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
