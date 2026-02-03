"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar, MapPin, ArrowLeft, Save, Loader2,
    Building2, Ticket, Users, Church, Heart, Music,
    PartyPopper, Briefcase, ShoppingBag, UsersRound, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Link from "next/link";

type PassType = "event" | "access";
type PassCategory = "all" | "concerts" | "workplace" | "events" | "retail" | "access" | "community" | "temples" | "spiritual";

interface LocationData {
    name: string;
    lat?: number;
    lng?: number;
    address?: string;
}

export default function CreatePassPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "event" as PassType,
        category: "all" as PassCategory,
        dateStart: "",
        dateEnd: "",
    });
    const [location, setLocation] = useState<LocationData>({
        name: "",
    });
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);

    const categories = [
        { value: "all", label: "All Passes", icon: Ticket },
        { value: "concerts", label: "Concerts", icon: Music },
        { value: "workplace", label: "Workplace", icon: Briefcase },
        { value: "events", label: "Events", icon: PartyPopper },
        { value: "retail", label: "Retail", icon: ShoppingBag },
        { value: "access", label: "Access", icon: Building2 },
        { value: "community", label: "Community", icon: UsersRound },
        { value: "temples", label: "Temples", icon: Church },
        { value: "spiritual", label: "Spiritual", icon: Heart },
    ];

    // Load Google Maps
    useEffect(() => {
        if (typeof window !== "undefined" && !window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => setMapLoaded(true);
            document.head.appendChild(script);
        } else if (window.google) {
            setMapLoaded(true);
        }
    }, []);

    // Initialize map
    useEffect(() => {
        if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: 25.2048, lng: 55.2708 }, // Dubai default
                zoom: 12,
            });
            mapInstanceRef.current = map;

            // Add click listener to place marker
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    placeMarker(e.latLng, map);
                }
            });
        }
    }, [mapLoaded]);

    const placeMarker = (latLng: google.maps.LatLng, map: google.maps.Map) => {
        // Remove existing marker
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // Create new marker
        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: true,
        });
        markerRef.current = marker;

        // Update location data
        const lat = latLng.lat();
        const lng = latLng.lng();

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                setLocation({
                    name: results[0].formatted_address.split(",")[0] || "Selected Location",
                    lat,
                    lng,
                    address: results[0].formatted_address,
                });
            } else {
                setLocation({
                    name: "Selected Location",
                    lat,
                    lng,
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                });
            }
        });

        // Update on drag
        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            if (position) {
                placeMarker(position, map);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                location: location.lat && location.lng ? location : undefined,
                dateStart: formData.dateStart ? new Date(formData.dateStart).toISOString() : undefined,
                dateEnd: formData.dateEnd ? new Date(formData.dateEnd).toISOString() : undefined,
            };

            const res = await fetch("/api/admin/passes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create pass");
            }

            alert("Pass created successfully!");
            router.push("/admin/passes");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/passes"
                        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-smart-teal transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Passes
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Create New Pass
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-smart-silver/80">
                        Create a new pass for events, access, or memberships
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info Card */}
                    <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Ticket className="w-6 h-6 text-smart-teal" />
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Pass Name *
                                </Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Community Yoga Session"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what this pass is for..."
                                    className="min-h-[120px] rounded-xl"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="type" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                        Pass Type *
                                    </Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: PassType) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="event">Event</SelectItem>
                                            <SelectItem value="access">Access</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="category" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                        Category *
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: PassCategory) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time Card */}
                    <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-smart-amber" />
                            Date & Time
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dateStart" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Start Date & Time
                                </Label>
                                <Input
                                    id="dateStart"
                                    type="datetime-local"
                                    value={formData.dateStart}
                                    onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="dateEnd" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    End Date & Time
                                </Label>
                                <Input
                                    id="dateEnd"
                                    type="datetime-local"
                                    value={formData.dateEnd}
                                    onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-green-500" />
                            Location
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Pin Location on Map
                                </Label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Click on the map to pin the location. You can drag the marker to adjust.
                                </p>
                                <div
                                    ref={mapRef}
                                    className="w-full h-[400px] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden"
                                />
                            </div>

                            {location.lat && location.lng && (
                                <div className="p-4 rounded-xl bg-smart-teal/5 border border-smart-teal/20 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-smart-teal mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white">{location.name}</p>
                                            {location.address && (
                                                <p className="text-sm text-gray-600 dark:text-smart-silver/80 mt-1">
                                                    {location.address}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">
                                                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="locationName" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Location Name (Optional Override)
                                </Label>
                                <Input
                                    id="locationName"
                                    value={location.name}
                                    onChange={(e) => setLocation({ ...location, name: e.target.value })}
                                    placeholder="e.g., Central Park, Main Hall"
                                    className="h-12 rounded-xl"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Full Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={location.address || ""}
                                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                    placeholder="Complete address will be auto-filled when you pin location on map"
                                    className="min-h-[80px] rounded-xl"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    This will be auto-filled from Google Maps when you pin a location
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={loading || !formData.name}
                            className="flex-1 bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal h-14 rounded-xl font-black text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating Pass...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Pass
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/passes")}
                            className="px-8 h-14 rounded-xl font-bold"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
