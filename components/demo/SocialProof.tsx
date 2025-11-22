'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'VP Marketing',
    company: 'TechCorp',
    image: '/images/user1.jpg',
    text: '"SmartWave transformed how our team networks. The iOS Wallet integration is seamless, and the customization options are incredible. Our connection rate increased by 300%."',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Creative Director',
    company: 'DesignStudio',
    image: '/images/user2.jpg',
    text: '"The design quality is outstanding. Clients are always impressed when I share my card with a simple tap. It\'s become a conversation starter that leads to better business relationships."',
  },
  {
    name: 'Priya Patel',
    role: 'CEO',
    company: 'StartupHub',
    image: '/images/user3.jpg',
    text: '"As an eco-conscious company, SmartWave aligns with our values. The environmental impact of going digital, combined with the professional presentation, makes this a no-brainer."',
  },
];

const clientLogos = ['TechCorp', 'DesignStudio', 'StartupHub', 'InnovateLab', 'GlobalTech'];

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-smart-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Trusted by Industry Leaders</h2>
          <p className="text-xl text-smart-silver/80">Join thousands of professionals who've transformed their networking</p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-16">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="testimonial-card p-8 rounded-2xl">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-smart-silver/60">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-lg mb-4">{testimonial.text}</p>
                    <div className="flex text-smart-amber">
                      ★★★★★
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-smart-teal' : 'bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Client Logos */}
        <div className="mt-16 text-center">
          <p className="text-smart-silver/60 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {clientLogos.map((logo, index) => (
              <div key={index} className="text-2xl font-bold">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

