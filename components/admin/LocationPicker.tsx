"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2, MapPin, Crosshair } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const containerStyle = {
    width: '100%',
    height: '300px'
};

const defaultCenter = {
    lat: 40.730610,
    lng: -73.935242
};

interface LocationPickerProps {
    lat?: number;
    lng?: number;
    zoom?: number;
    onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ lat, lng, zoom = 12, onLocationChange }: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [center, setCenter] = useState(defaultCenter);
    const [isLocating, setIsLocating] = useState(false);

    // Initial setup: If lat/lng provided, use them. If not, try geolocation.
    useEffect(() => {
        if (lat && lng) {
            setMarkerPosition({ lat, lng });
            setCenter({ lat, lng });
        } else {
            // If no lat/lng provided initially, try to get current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setCenter(pos);
                    },
                    (err) => {
                        console.log("Geolocation default error", err);
                        // stay on default center
                    }
                );
            }
        }
    }, [lat, lng]);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(pos);
                    setMarkerPosition(pos); // Also drop the pin there
                    onLocationChange(pos.lat, pos.lng);
                    setIsLocating(false);
                    if (map) {
                        map.panTo(pos);
                        map.setZoom(15);
                    }
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    setIsLocating(false);
                    // You might want to show a toast here in a real app
                }
            );
        } else {
            alert("Geolocation is not supported by your browser");
        }
    };

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const onClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setMarkerPosition({ lat: newLat, lng: newLng });
            onLocationChange(newLat, newLng);
        }
    };

    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setMarkerPosition({ lat: newLat, lng: newLng });
            onLocationChange(newLat, newLng);
        }
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full h-[300px] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-10 h-10 text-zinc-600 mb-4" />
                <h3 className="text-zinc-300 font-semibold mb-2">Google Maps Integration</h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                    Please configure <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your environment variables to enable the map picker.
                </p>
                <div className="mt-4 p-4 bg-zinc-950 rounded border border-zinc-800 w-full max-w-xs text-xs text-left font-mono text-zinc-400">
                    <p>Current Value: <span className="text-red-400">Missing</span></p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[300px] bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="rounded-lg overflow-hidden border border-zinc-800 relative group">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onClick}
                options={{
                    styles: [
                        {
                            "elementType": "geometry",
                            "stylers": [{ "color": "#242f3e" }]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#242f3e" }]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#746855" }]
                        },
                        // ... more dark mode styles can be added here
                    ],
                    disableDefaultUI: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scrollwheel: false, // Prevent accidental scrolling
                }}
            >
                {markerPosition && (
                    <Marker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={onMarkerDragEnd}
                    />
                )}
            </GoogleMap>

            <button
                type="button"
                onClick={handleLocateMe}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black backdrop-blur p-2 rounded-lg border border-white/10 text-white shadow-lg transition-colors z-10"
                title="Use Current Location"
            >
                {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
            </button>

            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur p-3 rounded-lg border border-white/10 text-xs text-zinc-400 flex justify-between items-center pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
                <span>Click map or drag pin to set location</span>
                {markerPosition && (
                    <span className="font-mono text-white">
                        {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                    </span>
                )}
            </div>
        </div>
    );
}
