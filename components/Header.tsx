'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Avatar from './Avatar';
import Navigation from './Navigation';
import NotificationBell from './NotificationBell';
import {
  Menu, X, DollarSign, ShoppingBag,
  BookOpen, IdCard, Globe, LayoutDashboard,
  ExternalLink, ChevronDown, Bell, Ticket
} from 'lucide-react';
import AboutDropdown from './AboutDropdown';
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { status, data: session } = useSession();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const isAuthenticated = status === 'authenticated';
  const isCorporateEmployee = (session?.user as { role?: string })?.role === 'employee';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Pricing', href: '/pricing', icon: DollarSign, show: !isCorporateEmployee },
    { name: 'Store', href: '/store', icon: ShoppingBag, show: isAuthenticated && !isCorporateEmployee },
    { name: 'Passes', href: '/passes', icon: Ticket, show: isAuthenticated },
    { name: 'Edit Profile', href: '/myprofile', icon: IdCard, show: isAuthenticated },
    { name: 'Guide Me', href: '/guide-me', icon: BookOpen, show: isAuthenticated && !isCorporateEmployee },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none px-4 ${isScrolled ? 'pt-4' : 'pt-6'}`}>
        <nav className={`
          mx-auto max-w-7xl pointer-events-auto
          transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10 py-2'
            : 'bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/10 dark:border-white/5 py-4'
          }
          rounded-[2rem] px-6 flex items-center justify-between
        `}>
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2 no-underline">
              <div className="logo-icon transition-transform duration-300 group-hover:scale-110">
                <span className="logo-icon-text">sw</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-smart-teal transition-colors">
                SmartWave
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.filter(link => link.show).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                      ${isActive
                        ? 'bg-smart-teal text-white shadow-[0_4px_15px_rgba(0,212,170,0.3)]'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-smart-teal'
                      }
                    `}
                  >
                    <link.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'group-hover:text-smart-teal'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-smart-teal rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Center Dropdown (Hidden on Mobile) */}
            <div className="hidden md:block">
              <AboutDropdown />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isAuthenticated && itemCount > 0 && !isCorporateEmployee && (
                <Link href="/cart" className="relative group">
                  <Button
                    className="
                      animate-breathe-x font-bold bg-sky-500 hover:bg-sky-600 text-white 
                      rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm 
                      border-none shadow-lg h-10 px-4 transition-all duration-300 hover:scale-105 active:scale-95
                    "
                    size="sm"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    <span>Checkout ({itemCount})</span>
                  </Button>
                </Link>
              )}

              <div className="hidden md:flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-3 ml-1">
                <NotificationBell />
                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>
                <ThemeToggle />
                <Avatar />
                <AuthButton />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute top-24 left-4 right-4 bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-2xl border border-gray-200 dark:border-white/10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 px-4">Navigation</span>
                  {navLinks.filter(link => link.show).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl transition-all
                        ${pathname === link.href
                          ? 'bg-smart-teal/10 text-smart-teal font-bold'
                          : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                        }
                      `}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="text-lg">{link.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <Avatar />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold dark:text-white">Account</span>
                        <AuthButton />
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                {!isCorporateEmployee && (
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl bg-smart-teal text-white font-bold text-lg">
                      Cart ({itemCount})
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}