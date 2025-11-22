'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function DemoHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedText, setTypedText] = useState('');
  const [mounted, setMounted] = useState(false);
  const words = ['Networking', 'Connection', 'Business'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Particle animation
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.3)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted]);

  // Typed text effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && typedText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const speed = isDeleting ? 50 : 100;
      timeout = setTimeout(() => {
        setTypedText(
          isDeleting
            ? currentWord.substring(0, typedText.length - 1)
            : currentWord.substring(0, typedText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentWordIndex]);

  const scrollToCustomizer = () => {
    const element = document.getElementById('customizer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const playDemo = () => {
    // Could open a video modal or navigate to a demo page
    console.log('Play demo clicked');
  };

  return (
    <section id="home" className="hero-bg min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-nfc.jpg"
          alt="NFC Technology Background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      <div className="aurora-flow"></div>
      <canvas 
        ref={canvasRef} 
        id="particleCanvas" 
        className="particle-canvas"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
      ></canvas>

      <div className="content-layer w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-smart-teal/10 border border-smart-teal/30 rounded-full text-smart-teal text-sm font-medium">
                  🚀 The Future of Networking is Here
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block">The Future of</span>
                  <span className="block text-gradient" id="typed-text">
                    {typedText}
                    <span className="animate-pulse">|</span>
                  </span>
                </h1>
                <p className="text-xl text-smart-silver/80 leading-relaxed max-w-lg">
                  Join the $4.2B contactless revolution. SmartWave delivers premium NFC business cards with iOS Wallet integration, QR codes, and multi-themed digital experiences that transform how professionals connect.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToCustomizer}
                  className="bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  Try Card Customizer
                </button>
                <button
                  onClick={playDemo}
                  className="border border-smart-silver/30 hover:border-smart-teal text-smart-silver hover:text-smart-teal px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  Watch Demo
                </button>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-smart-teal">20%</div>
                  <div className="text-sm text-smart-silver/60">Market Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-smart-amber">$4.2B</div>
                  <div className="text-sm text-smart-silver/60">Market Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-smart-charcoal dark:text-white">70%</div>
                  <div className="text-sm text-smart-silver/60">Contactless Rise</div>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="relative">
              <div className="floating-card">
                <div className="w-full max-w-md mx-auto card-3d glow-edge rounded-2xl overflow-hidden">
                  <Image
                    src="/images/card-mockup.png"
                    alt="SmartWave NFC Card"
                    width={400}
                    height={250}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-smart-teal/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-smart-amber/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

