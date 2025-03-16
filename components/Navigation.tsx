'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { 
  Mail, 
  DollarSign, 
  IdCardIcon, 
  Rocket 
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/contact-us', label: 'Contact', icon: Mail },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/about-smartwave', label: 'About Smartwave', icon: IdCardIcon },
  { href: '/about-xbeyond', label: 'About xBeyond', icon: Rocket },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 md:flex-row md:gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="group flex items-center gap-2 text-sm"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-md p-2 transition-colors ${
                isActive 
                  ? 'text-red-500' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive 
                    ? 'text-red-500' 
                    : 'text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200'
                }`} />
              </motion.div>
              <span className="hidden font-medium md:inline">{item.label}</span>
              <span className="text-xs md:hidden">{item.label.split(' ')[0]}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
} 