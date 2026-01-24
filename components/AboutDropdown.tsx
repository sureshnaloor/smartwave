'use client';

import { Info, IdCard, Rocket, Mail, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AboutDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const isAboutPage = pathname === '/about-smartwave' || pathname === '/about-xbeyond' || pathname === '/contact-us';

  const handleSmartwave = () => {
    router.push('/about-smartwave');
  };

  const handleXBeyond = () => {
    router.push('/about-xbeyond');
  };

  const handleContact = () => {
    router.push('/contact-us');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none ${isAboutPage
          ? 'bg-smart-teal text-white shadow-[0_4px_15px_rgba(0,212,170,0.3)]'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-smart-teal'
        }`}>
        <Info className="h-4 w-4" />
        <span className="hidden md:inline">About</span>
        <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleSmartwave} className="cursor-pointer">
          <IdCard className="mr-2 h-4 w-4" />
          <span>About Smartwave</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleXBeyond} className="cursor-pointer">
          <Rocket className="mr-2 h-4 w-4" />
          <span>About xBeyond</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleContact} className="cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          <span>Contact</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 