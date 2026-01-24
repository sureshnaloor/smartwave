'use client';

import React, { useState } from 'react';
import '../terms/PolicyPages.css';
import Link from 'next/link';

export default function PrivacyPage() {
    const [activeTab, setActiveTab] = useState('privacy');

    return (
        <div className="policy-container">
            <header className="policy-header">
                <h1>Legal Policies</h1>
                <p className="subtitle">Please read our terms and policies carefully to understand your rights and obligations.</p>

                <div className="policy-tabs">
                    <Link href="/terms" className="tab-button">
                        Terms of Service
                    </Link>
                    <button
                        className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        Privacy Policy
                    </button>
                </div>
            </header>

            <div className="policy-content">
                <article className="policy-document">
                    <div className="document-header">
                        <h2>Privacy Policy</h2>
                        <p className="effective-date">Last Updated: January 24, 2026</p>
                        <div className="company-info">
                            <p><strong>Entity:</strong> xBeyond LLP (SmartWave)</p>
                            <p><strong>Email:</strong> smart@smartwave.name</p>
                        </div>
                    </div>

                    <div className="intro">
                        At SmartWave, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                    </div>

                    <section className="policy-section">
                        <h3>1. Information We Collect</h3>
                        <p>We collect information that you provide directly to us when you:</p>
                        <ul>
                            <li>Create an account or digital business card.</li>
                            <li>Contact our support team.</li>
                            <li>Sign up for our newsletter.</li>
                        </ul>
                        <p>This may include your name, email address, job title, company name, and any other contact details you choose to share on your digital card.</p>
                    </section>

                    <section className="policy-section">
                        <h3>2. How We Use Your Information</h3>
                        <p>We use the collected information to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Process your transactions and send you related information.</li>
                            <li>Send you technical notices, updates, and security alerts.</li>
                            <li>Respond to your comments and questions.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h3>3. Data Sharing and Disclosure</h3>
                        <p>
                            We do not sell your personal information. We only share your information in the following circumstances:
                        </p>
                        <ul>
                            <li>When you share your digital business card with others.</li>
                            <li>With vendors and service providers who perform services for us.</li>
                            <li>To comply with legal obligations.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h3>4. Data Security</h3>
                        <p>
                            We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission is 100% secure.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h3>5. Your Choices</h3>
                        <p>
                            You can access, update, or delete your account information at any time by logging into your account settings. You may also opt out of receiving promotional emails from us.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h3>6. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <div className="contact-box">
                            <p><strong>Email:</strong> smart@smartwave.name</p>
                            <p><strong>Developer:</strong> xBeyond LLP</p>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
}
