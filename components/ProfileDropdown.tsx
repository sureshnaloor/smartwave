'use client';

import { IdCard, BookOpen, Globe, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navigation from './Navigation';

export default function ProfileDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
  const isProfilePage = pathname === '/myprofile' || pathname === '/guide-me';
  
  const handleMyProfile = () => {
    router.push('/myprofile');
  };
  
  const handleGuideMe = () => {
    router.push('/guide-me');
  };
  
  // Don't show if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none ${
        isProfilePage
          ? 'bg-smart-teal/10 text-smart-teal dark:bg-smart-teal/20 dark:text-smart-teal'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
      }`}>
        <span className="hidden md:inline">Profile</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleMyProfile} className="cursor-pointer">
          <IdCard className="mr-2 h-4 w-4" />
          <span>Create/Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGuideMe} className="cursor-pointer">
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Guide Me</span>
        </DropdownMenuItem>
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Navigation variant="country-selector" />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

