"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface PhotoUploadProps {
    currentPhotoUrl?: string;
    onPhotoUploaded: (url: string) => void;
    className?: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export default function PhotoUpload({ currentPhotoUrl, onPhotoUploaded, className }: PhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");

        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only JPG or PNG images are allowed.");
            return;
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        try {
            setIsUploading(true);
            const result = await uploadToCloudinary(file, "employee-photos");
            onPhotoUploaded(result.secure_url);
        } catch (err) {
            console.error(err);
            setError("Failed to upload photo. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onPhotoUploaded("");
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-4">
                {currentPhotoUrl ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={currentPhotoUrl}
                            alt="Profile URL"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            title="Remove photo"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-8 h-8 text-zinc-400" />
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300 font-medium">Profile Photo</Label>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-fit"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" /> Upload Photo
                                    </>
                                )}
                            </Button>
                            {currentPhotoUrl && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-zinc-500">JPG or PNG, max 5MB.</p>
                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
