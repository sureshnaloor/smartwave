"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuthNavigation = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleNavigation = (destination: string) => {
        // Check if it's a special protocol link (mailto, tel, etc)
        if (destination.startsWith("mailto:") || destination.startsWith("tel:")) {
            window.location.href = destination;
            return;
        }

        if (session) {
            // User is logged in, proceed to destination
            router.push(destination);
        } else {
            // User is not logged in
            toast.success("Great decision!", {
                description: "Please sign in to enjoy your exclusive plans.",
                duration: 4000,
                action: {
                    label: "Sign In",
                    onClick: () => {
                        const encodedCallback = encodeURIComponent(destination);
                        router.push(`/auth/signin?callbackUrl=${encodedCallback}`);
                    }
                }
            });

            const encodedCallback = encodeURIComponent(destination);
            // Add a small delay for the user to read the toast, or redirect immediately?
            // User said: "he/she should be welcomed with a great decision... and the journey should show them the google sign in page"
            // Immediate redirect + Toast might be jarring if the page reloads.
            // But typically we do redirect.

            // Let's redirect immediately but maybe with a customized param 
            // so the Login page can also show a welcome message?
            // For now, strict redirect.
            router.push(`/auth/signin?callbackUrl=${encodedCallback}`);
        }
    };

    return handleNavigation;
};
