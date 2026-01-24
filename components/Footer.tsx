'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Twitter, Instagram, Linkedin,
  Github, Mail, MapPin, Phone,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Pricing', href: '/pricing' },
        { name: 'Store', href: '/store' },
        { name: 'Digital Profile', href: '/myprofile' },
        { name: 'Guide Me', href: '/guide-me' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about-smartwave' },
        { name: 'Contact', href: '/contact-us' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'API Status', href: '#' },
        { name: 'Custom Orders', href: '/contact-us' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Github, href: '#' },
  ];

  return (
    <footer className="relative bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-smart-teal to-transparent opacity-30" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-smart-teal/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 no-underline group w-fit">
              <div className="logo-icon transition-transform duration-300 group-hover:scale-110">
                <span className="logo-icon-text">sw</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                SmartWave
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
              The next generation of professional networking. Sustainable, smart, and seamlessly integrated with your digital life.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="p-3 rounded-full bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-smart-teal hover:text-white transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section, idx) => (section.title && (
            <div key={idx} className="lg:col-span-1">
              <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide uppercase text-xs">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-smart-teal dark:hover:text-smart-teal transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">{link.name}</span>
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )))}

          {/* Contact Column */}
          <div className="lg:col-span-1 min-w-[180px]">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide uppercase text-xs">
              Stay Connected
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-smart-teal mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-tighter">Email Us</p>
                  <a href="mailto:smart@smartwave.name" className="text-sm text-gray-600 dark:text-gray-300 hover:text-smart-teal transition-colors">
                    smart@smartwave.name
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-smart-amber mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-tighter">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    xBeyond LLP<br />Global Presence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
            <span>© {currentYear} SmartWave Cards.</span>
            <span className="hidden md:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <span className="flex items-center gap-1">
              Crafted by <span className="text-smart-teal font-bold tracking-tight">xBeyond LLP</span>
            </span>
          </div>

          <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Link href="/privacy" className="hover:text-smart-teal transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-smart-teal transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-smart-teal transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;