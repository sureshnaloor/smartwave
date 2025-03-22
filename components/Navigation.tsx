'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { 
  Mail, 
  DollarSign, 
  IdCardIcon as IdCard, 
  Rocket,
  ShoppingBag,
  ShoppingCart,
  Package,
  Heart
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: '/store', label: 'Store', icon: ShoppingBag, requiresAuth: true },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, requiresAuth: true },
  { href: '/wishlist', label: 'Wishlist', icon: Heart, requiresAuth: true },
  { href: '/orders', label: 'Orders', icon: Package, requiresAuth: true },
  { href: '/contact-us', label: 'Contact', icon: Mail, requiresAuth: false },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, requiresAuth: false },
  { href: '/about-smartwave', label: 'About Smartwave', icon: IdCard, requiresAuth: false },
  { href: '/about-xbeyond', label: 'About xBeyond', icon: Rocket, requiresAuth: false },
];

export default function Navigation() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Filter the navigation items based on authentication state
  const visibleNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="flex flex-col gap-2 md:flex-row md:gap-6">
      {visibleNavItems.map((item) => {
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