'use client';

import { User, Heart, ShoppingCart, Package, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Avatar() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleWishlistClick = () => {
    router.push('/wishlist');
  };
  
  const handleCartClick = () => {
    router.push('/cart');
  };
  
  const handleOrdersClick = () => {
    router.push('/orders');
  };
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // No avatar if user is not logged in
  if (!session?.user) {
    return null;
  }

  // Get first two characters of the name
  const getNameChars = () => {
    const name = session?.user?.name || session?.user?.email || 'User';
    return name.substring(0, 2).toUpperCase();
  };

  // Define colors for first and second character
  const textColors = [
    'text-blue-600',
    'text-purple-600',
    'text-green-600',
    'text-yellow-600',
    'text-indigo-600',
  ];

  // Use email or name to consistently get same colors for same user
  const userString = session.user.email || session.user.name || '';
  const colorIndex1 = Math.abs(userString.charCodeAt(0) % textColors.length);
  const colorIndex2 = Math.abs(userString.charCodeAt(1) % textColors.length);

  const chars = getNameChars();

  // Avatar with dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session.user.image ? (
          <button
            className="w-8 h-8 rounded-full overflow-hidden
              hover:animate-wiggle cursor-pointer
              transition-transform duration-200"
            aria-label="User menu"
          >
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={32}
              height={32}
              className="object-cover"
            />
          </button>
        ) : (
          <button
            className="w-8 h-8 rounded-full bg-red-100 
              flex items-center justify-center
              hover:animate-wiggle cursor-pointer
              transition-transform duration-200"
            aria-label="User menu"
          >
            <span className="text-sm font-medium flex">
              <span className={textColors[colorIndex1]}>{chars[0]}</span>
              <span className={textColors[colorIndex2]}>{chars[1]}</span>
            </span>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {session.user.name || session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWishlistClick} className="cursor-pointer">
          <Heart className="mr-2 h-4 w-4" />
          <span>Wishlist</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCartClick} className="cursor-pointer">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span>Cart</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOrdersClick} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 