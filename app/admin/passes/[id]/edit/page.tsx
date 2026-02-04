"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Calendar, MapPin, ArrowLeft, Save, Loader2,
    Building2, Ticket, Users, Church, Heart, Music,
    PartyPopper, Briefcase, ShoppingBag, UsersRound, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useJsApiLoader } from "@react-google-maps/api";


type PassType = "event" | "access";
type PassCategory = "all" | "concerts" | "workplace" | "events" | "retail" | "access" | "community" | "temples" | "spiritual";

interface LocationData {
    name: string;
    lat?: number;
    lng?: number;
    address?: string;
}

export default function EditPassPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "event" as PassType,
        category: "all" as PassCategory,
        dateStart: "",
        dateEnd: "",
        status: "draft" as "draft" | "active"
    });
    const [location, setLocation] = useState<LocationData>({
        name: "",
    });

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

    // Fetch existing pass data
    useEffect(() => {
        const fetchPass = async () => {
            try {
                const res = await fetch(`/api/admin/passes/${params.id}`);
                const data = await res.json();
                if (res.ok && data.pass) {
                    const pass = data.pass;
                    setFormData({
                        name: pass.name || "",
                        description: pass.description || "",
                        type: pass.type || "event",
                        category: pass.category || "all",
                        dateStart: pass.dateStart ? new Date(pass.dateStart).toISOString().slice(0, 16) : "",
                        dateEnd: pass.dateEnd ? new Date(pass.dateEnd).toISOString().slice(0, 16) : "",
                        status: pass.status || "draft"
                    });
                    if (pass.location) {
                        setLocation({
                            name: pass.location.name || "",
                            lat: pass.location.lat,
                            lng: pass.location.lng,
                            address: pass.location.address || ""
                        });
                    }
                } else {
                    alert(data.error || "Failed to fetch pass");
                    router.push("/admin/passes");
                }
            } catch (err) {
                console.error("Error fetching pass:", err);
                router.push("/admin/passes");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPass();
        }
    }, [params.id, router]);

    const { isLoaded: mapLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ['places']
    });


    // Initialize/Update map
    useEffect(() => {
        if (mapLoaded && mapRef.current && !loading) {
            const center = location.lat && location.lng
                ? { lat: location.lat, lng: location.lng }
                : { lat: 25.2048, lng: 55.2708 }; // Dubai default

            if (!mapInstanceRef.current) {
                const map = new google.maps.Map(mapRef.current, {
                    center,
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

            // Place initial marker if it exists
            if (location.lat && location.lng && !markerRef.current) {
                const latLng = new google.maps.LatLng(location.lat, location.lng);
                placeMarker(latLng, mapInstanceRef.current!);
                mapInstanceRef.current!.setCenter(latLng);
                mapInstanceRef.current!.setZoom(15);
            }
        }
    }, [mapLoaded, loading]);

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
        setSaving(true);

        try {
            const payload = {
                ...formData,
                location: location.lat && location.lng ? location : null,
                dateStart: formData.dateStart ? new Date(formData.dateStart).toISOString() : null,
                dateEnd: formData.dateEnd ? new Date(formData.dateEnd).toISOString() : null,
            };

            const res = await fetch(`/api/admin/passes/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update pass");
            }

            alert("Pass updated successfully!");
            router.push("/admin/passes");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-smart-teal" />
            </div>
        );
    }

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
                        Edit Pass
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-smart-silver/80">
                        Update pass details, location, and status
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
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PassType })}
                                        className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 text-sm focus:outline-none focus:ring-2 focus:ring-smart-teal"
                                    >
                                        <option value="event">Event</option>
                                        <option value="access">Access</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="category" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                        Category *
                                    </Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as PassCategory })}
                                        className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 text-sm focus:outline-none focus:ring-2 focus:ring-smart-teal"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-sm font-bold uppercase tracking-wider mb-2 block">
                                    Status *
                                </Label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "active" })}
                                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 text-sm focus:outline-none focus:ring-2 focus:ring-smart-teal"
                                >
                                    <option value="draft">Draft (Hidden from users)</option>
                                    <option value="active">Active (Visible to users)</option>
                                </select>
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
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={saving || !formData.name}
                            className="flex-1 bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal h-14 rounded-xl font-black text-lg"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Updating Pass...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
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
