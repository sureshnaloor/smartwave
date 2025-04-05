export default function PricingFeatures() {
  const features = [
    {
      title: "NFC Technology",
      description: "Share your contact details instantly with a simple tap",
      icon: "🌟"
    },
    {
      title: "Digital Business Card",
      description: "Professional online presence with your digital profile",
      icon: "💼"
    },
    {
      title: "QR Code Integration",
      description: "Easy sharing with built-in QR code functionality",
      icon: "📱"
    },
    {
      title: "vCard Support",
      description: "Compatible with all major contact management systems",
      icon: "📇"
    },
    {
      title: "Contact Analytics",
      description: "Track when and how your card is being used",
      icon: "📊"
    },
    {
      title: "Instant Updates",
      description: "Update your contact information anytime, anywhere",
      icon: "🔄"
    }
  ]

  return (
    <div className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Why Choose Smartwave?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}