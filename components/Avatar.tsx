'use client';

import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Avatar() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/profile');
  };

  // No avatar if user is not logged in
  if (!session?.user) {
    return null;
  }

  // If user has an image, show it
  if (session.user.image) {
    return (
      <button
        onClick={handleClick}
        className="w-8 h-8 rounded-full overflow-hidden
          hover:animate-wiggle cursor-pointer
          transition-transform duration-200"
        aria-label="View profile"
      >
        <Image
          src={session.user.image}
          alt={session.user.name || 'User avatar'}
          width={32}
          height={32}
          className="object-cover"
        />
      </button>
    );
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

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 rounded-full bg-red-100 
        flex items-center justify-center
        hover:animate-wiggle cursor-pointer
        transition-transform duration-200"
      aria-label="View profile"
    >
      <span className="text-sm font-medium flex">
        <span className={textColors[colorIndex1]}>{chars[0]}</span>
        <span className={textColors[colorIndex2]}>{chars[1]}</span>
      </span>
    </button>
  );
} 