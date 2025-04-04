import { useState } from 'react';
import { FaQrcode, FaPen, FaAddressCard, FaGlobe, FaCreditCard, FaUsers } from 'react-icons/fa6';
import Modal from '../ui/Modal';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: any, 
  title: string, 
  description: string,
  onClick: () => void 
}) => (
  <div 
    className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl cursor-pointer" 
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      <Icon className="text-blue-600 text-2xl mr-3" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function UserOverview() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const featureDetails = [
    {
      icon: FaQrcode,
      title: "Digital Business Card with QR",
      description: "Create your digital business card with a QR code that others can scan to instantly add your contact details to their phone - no internet required!",
      modalContent: (
        <div className="space-y-4">
          <p>Your QR-enabled digital business card includes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Instant contact sharing without internet connectivity</li>
            <li>Compatible with all modern smartphone cameras</li>
            <li>Includes all your professional details</li>
            <li>One-scan addition to phone contacts</li>
            <li>Customizable QR code design</li>
            <li>Print-ready format</li>
          </ul>
        </div>
      )
    },
    {
      icon: FaAddressCard,
      title: "vCard Download",
      description: "Download your contact information as a vCard file that can be easily imported into any contact application.",
      modalContent: (
        <div className="space-y-4">
          <p>The vCard (.vcf) feature provides:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Universal compatibility with all contact apps</li>
            <li>Includes complete contact information:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Name and title</li>
              <li>Multiple phone numbers</li>
              <li>Email addresses</li>
              <li>Social media profiles</li>
              <li>Company details</li>
            </ul>
            <li>Easy sharing via email or messaging</li>
            <li>One-click contact import</li>
            <li>Automatic updates when you modify your profile</li>
          </ul>
        </div>
      )
    },
    {
      icon: FaGlobe,
      title: "Digital Profile",
      description: "Get your own shareable web link with a professional digital profile, including an 'Add to Contact' feature - free forever!",
      modalContent: (
        <div className="space-y-4">
          <p>Your free digital profile features:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Professional web presence with custom URL</li>
            <li>Mobile-optimized design</li>
            <li>Integrated "Add to Contact" button</li>
            <li>Display for:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Professional summary</li>
              <li>Work experience</li>
              <li>Contact information</li>
              <li>Social media links</li>
            </ul>
            <li>Share via link or QR code</li>
            <li>View profile visit analytics</li>
          </ul>
        </div>
      )
    },
    {
      icon: FaCreditCard,
      title: "Premium Physical Cards",
      description: "Upgrade to premium to order NFC-enabled physical cards in plastic, colored, or metallic finishes for instant contact sharing.",
      modalContent: (
        <div className="space-y-4">
          <p>Premium physical card options include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Card Materials:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Premium plastic cards</li>
              <li>Metallic finish cards</li>
              <li>Custom colored cards</li>
              <li>Wood and special materials</li>
            </ul>
            <li>NFC Technology:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>One-tap contact sharing</li>
              <li>Works with all modern phones</li>
              <li>No app required for receiving</li>
            </ul>
            <li>Customization Options:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Custom designs</li>
              <li>Logo integration</li>
              <li>Color schemes</li>
            </ul>
          </ul>
        </div>
      )
    },
    {
      icon: FaUsers,
      title: "SmartWave Community",
      description: "Premium members join our exclusive AI-marketplace community to buy and sell products or services.",
      modalContent: (
        <div className="space-y-4">
          <p>Community membership benefits:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>AI-Powered Marketplace:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>List your products/services</li>
              <li>Smart matching with potential clients</li>
              <li>Automated lead generation</li>
            </ul>
            <li>Networking Features:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Direct messaging</li>
              <li>Business opportunity alerts</li>
              <li>Industry-specific groups</li>
            </ul>
            <li>Premium Benefits:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Priority listing placement</li>
              <li>Advanced analytics</li>
              <li>Verified member badge</li>
            </ul>
          </ul>
        </div>
      )
    },
    {
      icon: FaPen,
      title: "Profile Editing",
      description: "Choose from various payment options to enable profile editing - from one-time updates to unlimited lifetime editing.",
      modalContent: (
        <div className="space-y-4">
          <p>Profile editing options:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Editing Plans:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Single update pass</li>
              <li>Monthly subscription</li>
              <li>Annual unlimited updates</li>
              <li>Lifetime access</li>
            </ul>
            <li>Editable Elements:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Contact information</li>
              <li>Professional details</li>
              <li>Social media links</li>
              <li>Profile layout and design</li>
              <li>Custom fields</li>
            </ul>
            <li>Additional Features:</li>
            <ul className="list-circle pl-5 space-y-1">
              <li>Change tracking</li>
              <li>Revision history</li>
              <li>Auto-sync across platforms</li>
            </ul>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to SmartWave! Here's what you can do:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureDetails.map((feature, index) => (
          <FeatureCard 
            key={index} 
            {...feature} 
            onClick={() => setSelectedFeature(index)}
          />
        ))}
      </div>

      <Modal
        isOpen={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        title={selectedFeature !== null ? featureDetails[selectedFeature].title : ''}
      >
        {selectedFeature !== null && featureDetails[selectedFeature].modalContent}
      </Modal>
    </div>
  );
}