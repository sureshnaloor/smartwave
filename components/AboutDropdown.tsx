'use client';

import { Info, IdCard, Rocket, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AboutDropdown() {
  const router = useRouter();
  
  const handleSmartwave = () => {
    router.push('/about-smartwave');
  };
  
  const handleXBeyond = () => {
    router.push('/about-xbeyond');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
        <Info className="h-5 w-5" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 