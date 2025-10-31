"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Options = {
  isDirty: boolean;
  profilePathStartsWith?: string; // e.g. "/profile"
  confirmMessage?: string;
};

export function useUnsavedChanges({
  isDirty,
  profilePathStartsWith = "/profile",
  confirmMessage = "You have unsaved changes. Are you sure you want to leave this page?",
}: Options) {
  const pathname = usePathname();

  // Warn on browser/tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Intercept link clicks navigating away from profile path only
  useEffect(() => {
    if (!isDirty) return;

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Ignore hash and same-page anchors
      if (href.startsWith("#")) return;

      const isWithinProfile = pathname.startsWith(profilePathStartsWith);
      const isNavigatingAway = !href.startsWith(profilePathStartsWith);

      if (isWithinProfile && isNavigatingAway) {
        event.preventDefault();
        const confirmed = window.confirm(confirmMessage);
        if (confirmed) {
          window.location.href = href;
        }
      }
    };

    document.addEventListener("click", clickHandler, true);
    return () => document.removeEventListener("click", clickHandler, true);
  }, [isDirty, pathname, profilePathStartsWith, confirmMessage]);
}

