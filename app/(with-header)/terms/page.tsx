'use client';

import React, { useState } from 'react';
import './PolicyPages.css';
import Link from 'next/link';

export default function TermsPage() {
    const [activeTab, setActiveTab] = useState('terms');

    return (
        <div className="policy-container">
            <header className="policy-header">
                <h1>Legal Policies</h1>
                <p className="subtitle">Please read our terms and policies carefully to understand your rights and obligations.</p>

                <div className="policy-tabs">
                    <button
                        className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('terms')}
                    >
                        Terms of Service
                    </button>
                    <Link href="/privacy" className="tab-button">
                        Privacy Policy
                    </Link>
                </div>
            </header>

            <div className="policy-content">
                <article className="policy-document">
                    <div className="document-header">
                        <h2>Terms of Service</h2>
                        <p className="effective-date">Last Updated: January 24, 2026</p>
                        <div className="company-info">
                            <p><strong>Entity:</strong> xBeyond LLP (SmartWave)</p>
                            <p><strong>Email:</strong> smart@smartwave.name</p>
                        </div>
                    </div>

                    <div className="intro">
                        Welcome to SmartWave. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
                    </div>

                    <section className="policy-section">
                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using the SmartWave platform, digital business cards, and related services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h3>2. User Accounts</h3>
                        <p>
                            To access certain features of our platform, you may be required to create an account. You are responsible for:
                        </p>
                        <ul>
                            <li>Maintaining the confidentiality of your account credentials.</li>
                            <li>All activities that occur under your account.</li>
                            <li>Providing accurate and complete information during registration.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h3>3. Digital Business Cards</h3>
                        <p>
                            SmartWave provides a platform for creating and sharing digital business cards. You retain ownership of the content you upload, but grant us a license to host and display it as part of the service.
                        </p>
                        <h4>Prohibited Content</h4>
                        <p>Users are prohibited from sharing content that is:</p>
                        <ul>
                            <li>Illegal, offensive, or harmful.</li>
                            <li>Infringing on intellectual property rights.</li>
                            <li>Impersonating others or misleading.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h3>4. Intellectual Property</h3>
                        <p>
                            The SmartWave name, logo, website design, and all software components are the intellectual property of xBeyond LLP. You may not copy, modify, or distribute any part of our service without explicit permission.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h3>5. Limitation of Liability</h3>
                        <p>
                            xBeyond LLP shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h3>6. Contact Us</h3>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <div className="contact-box">
                            <p><strong>Email:</strong> smart@smartwave.name</p>
                            <p><strong>Developer:</strong> xBeyond LLP</p>
                            <p><strong>Website:</strong> www.smartwave.app</p>
                        </div>
                    </section>
                </article>
            </div>
        </div>
    );
}