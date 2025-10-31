"use client";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { useState } from "react";
import { Spinner } from "@/components/ui/icons";

type Props = {
  value: string;
  onUploaded: (url: string) => void;
};

export default function CompanyLogoUpload({ value, onUploaded }: Props) {
  const [loading, setLoading] = useState(false);

  const onFile = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadToCloudinary(file, 'logos');
      onUploaded(res.secure_url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="block w-full h-full cursor-pointer">
      <input className="hidden" type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="w-full h-full rounded-md overflow-hidden border flex items-center justify-center bg-gray-50">
        {loading ? (
          <Spinner className="h-5 w-5 text-blue-600" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Company Logo" className="w-full h-full object-contain p-1" />
        ) : (
          <div className="text-xs text-gray-500">Add Logo</div>
        )}
      </div>
    </label>
  );
}


