'use client';

export default function AuroraBackground() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-normal dark:mix-blend-screen"
      aria-hidden="true"
    >
      <div className="absolute w-[60vw] h-[60vw] bg-[#00b4d8] opacity-[0.15] left-[-10%] top-[-10%] rounded-full blur-[80px] will-change-transform animate-aurora-blob-1" />
      <div className="absolute w-[50vw] h-[50vw] bg-[#00f5d4] opacity-[0.08] right-[-5%] top-[20%] rounded-full blur-[80px] will-change-transform animate-aurora-blob-2" />
      <div className="absolute w-[55vw] h-[55vw] bg-[#b87333] opacity-[0.06] left-[20%] bottom-[-10%] rounded-full blur-[80px] will-change-transform animate-aurora-blob-3" />
    </div>
  );
}
