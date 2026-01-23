'use client';

import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
}

const themes: Theme[] = [
  { id: 'minimalist', name: 'Minimalist', gradient: '#ffffff', textColor: '#1a1a1a' },
  { id: 'corporate', name: 'Corporate', gradient: '#1e3a8a', textColor: '#ffffff' },
  { id: 'luxury', name: 'Luxury', gradient: '#1a1a1a', textColor: '#ffffff' },
  { id: 'creative', name: 'Creative', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', textColor: '#ffffff' },
  { id: 'tech', name: 'Tech', gradient: '#0f172a', textColor: '#ffffff' },
  { id: 'nature', name: 'Nature', gradient: '#166534', textColor: '#ffffff' },
  { id: 'elegant', name: 'Elegant', gradient: '#ffffff', textColor: '#1a1a1a' },
  { id: 'modern', name: 'Modern', gradient: '#1e293b', textColor: '#ffffff' },
  { id: 'classic', name: 'Classic', gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)', textColor: '#ffffff' },
  { id: 'startup', name: 'Startup', gradient: '#9333ea', textColor: '#ffffff' },
  { id: 'premium', name: 'Premium', gradient: '#1e293b', textColor: '#ffffff' },
  { id: 'vibrant', name: 'Vibrant', gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)', textColor: '#ffffff' },
  { id: 'subtle', name: 'Subtle', gradient: '#ffffff', textColor: '#1a1a1a' },
  { id: 'bold', name: 'Bold', gradient: '#0c1226', textColor: '#ffffff' },
  { id: 'professional', name: 'Professional', gradient: '#2563eb', textColor: '#ffffff' },
];

const colors = [
  { name: 'Teal', value: '#00d4aa' },
  { name: 'Amber', value: '#ffb347' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

const fonts = [
  { value: 'display', label: 'Modern Sans' },
  { value: 'serif', label: 'Classic Serif' },
  { value: 'mono', label: 'Tech Mono' },
];

export default function CardCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[2]); // Luxury theme selected by default
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [selectedFont, setSelectedFont] = useState(fonts[0].value);
  const [cardName, setCardName] = useState('John Smith');
  const [cardTitle, setCardTitle] = useState('Creative Director');
  const [cardCompany, setCardCompany] = useState('SmartWave Technologies');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code - only on client side
    if (typeof window === 'undefined') return;

    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const qrData = `https://smartwave.name/profile/${encodeURIComponent(cardName)}`;
        const dataUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [cardName]);

  const saveDesign = () => {
    // Save design logic
    console.log('Saving design:', {
      theme: selectedTheme,
      color: selectedColor,
      font: selectedFont,
      name: cardName,
      title: cardTitle,
      company: cardCompany,
    });
    // Could show a toast or navigate to checkout
  };

  const getFontFamily = (font: string) => {
    switch (font) {
      case 'serif':
        return 'Georgia, serif';
      case 'mono':
        return 'JetBrains Mono, monospace';
      default:
        return 'Inter, sans-serif';
    }
  };

  return (
    <section id="customizer" className="py-20 bg-gradient-to-b from-smart-charcoal to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Design Your <span className="text-gradient">SmartWave Card</span>
          </h2>
          <p className="text-xl text-smart-silver/80 max-w-3xl mx-auto">
            Create your perfect NFC business card with our interactive studio. Choose from 15+ premium themes, customize colors, and see your QR code generate in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Theme Selector */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Choose Your Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex flex-col items-center space-y-2 transition-all ${selectedTheme.id === theme.id
                      ? 'scale-105'
                      : 'hover:scale-[1.02]'
                    }`}
                >
                  <div
                    className={`w-full h-20 rounded-lg border-2 transition-all ${selectedTheme.id === theme.id
                        ? 'border-smart-teal shadow-lg shadow-smart-teal/50 theme-card-selected'
                        : 'border-white/10 hover:border-white/30'
                      }`}
                    style={{ background: theme.gradient }}
                  />
                  <span className={`text-xs font-medium ${selectedTheme.id === theme.id
                      ? 'text-smart-teal'
                      : 'text-smart-silver'
                    }`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                id="cardPreview"
                className="w-80 h-48 rounded-2xl shadow-2xl transition-all duration-500 card-3d p-6 flex flex-col justify-between"
                style={{
                  background: selectedTheme.gradient,
                  fontFamily: getFontFamily(selectedFont),
                }}
              >
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: selectedTheme.textColor }}>
                    {cardName}
                  </div>
                  <div className="text-sm opacity-90" style={{ color: selectedTheme.textColor }}>
                    {cardTitle}
                  </div>
                </div>
                <div className="text-sm opacity-80" style={{ color: selectedTheme.textColor }}>
                  {cardCompany}
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* QR Code */}
            <div className="mt-6 text-center">
              <div className="qr-code">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-24 h-24 mx-auto rounded" />
                ) : (
                  <div className="w-24 h-24 bg-smart-charcoal rounded flex items-center justify-center text-white font-mono text-xs">
                    QR CODE
                  </div>
                )}
              </div>
              <p className="text-sm text-smart-silver/60 mt-2">Scan to connect instantly</p>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Customize</h3>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.value
                        ? 'border-white scale-110'
                        : 'border-white/20 hover:border-white/40'
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-medium mb-2">Typography</label>
              <select
                id="fontSelector"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  id="cardTitle"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  id="cardCompany"
                  value={cardCompany}
                  onChange={(e) => setCardCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
                />
              </div>
            </div>

            <button
              onClick={saveDesign}
              className="w-full bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal py-3 rounded-lg font-semibold transition-colors"
            >
              Save Design
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

