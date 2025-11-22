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
      <DropdownMenuTrigger className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none ${
        isAboutPage
          ? 'bg-smart-teal/10 text-smart-teal dark:bg-smart-teal/20 dark:text-smart-teal'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
      }`}>
        <Info className="h-4 w-4" />
        <span className="hidden md:inline">About</span>
        <ChevronDown className="h-4 w-4" />
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