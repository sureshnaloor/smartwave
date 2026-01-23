
import jwt from "jsonwebtoken";
import { ProfileData } from "@/app/_actions/profile";

export function generateGoogleWalletUrl(user: ProfileData) {
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
    const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT;

    // Deeper sanitization of the private key
    let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;
    if (privateKey) {
        // Remove surrounding quotes if they exist
        privateKey = privateKey.replace(/^["'](.+)["']$/, '$1');
        // Restore literal newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    const classId = process.env.GOOGLE_WALLET_CLASS_ID || "SmartWaveGenericClass";

    if (!issuerId || !serviceAccountEmail || !privateKey || privateKey.length < 50) {
        throw new Error("Google Wallet credentials missing or invalid in environment variables");
    }

    const objectId = `${issuerId}.${user._id?.toString() || Math.random().toString(36).substring(7)}_v2`;

    const payload = {
        iss: serviceAccountEmail,
        aud: "google",
        typ: "savetowallet",
        iat: Math.floor(Date.now() / 1000),
        payload: {
            genericObjects: [
                {
                    id: objectId,
                    classId: `${issuerId}.${classId}`,
                    genericType: "GENERIC_TYPE_UNSPECIFIED",
                    barcode: {
                        type: "QR_CODE",
                        value: user.shorturl ? `https://smartwave.name/publicprofile/${user.shorturl}` : `https://smartwave.name/profile/${user.userEmail}`,
                        alternateText: "Scan to view profile"
                    },
                    cardTitle: {
                        defaultValue: {
                            language: "en-US",
                            value: "SmartWave Digital Card"
                        }
                    },
                    header: {
                        defaultValue: {
                            language: "en-US",
                            value: user.name
                        }
                    },
                    subheader: {
                        defaultValue: {
                            language: "en-US",
                            value: user.title || "User"
                        }
                    },
                    logo: user.companyLogo ? {
                        sourceUri: {
                            uri: user.companyLogo
                        }
                    } : undefined,
                    heroImage: user.photo ? {
                        sourceUri: {
                            uri: user.photo
                        }
                    } : undefined,
                    textModulesData: [
                        {
                            header: "Work Phone",
                            body: user.workPhone || "N/A",
                            id: "work_phone"
                        },
                        {
                            header: "Mobile",
                            body: user.mobile || "N/A",
                            id: "mobile"
                        },
                        {
                            header: "Work Email",
                            body: user.workEmail || "N/A",
                            id: "work_email"
                        },
                        {
                            header: "Personal Email",
                            body: user.personalEmail || "N/A",
                            id: "personal_email"
                        }
                    ]
                }
            ]
        }
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return `https://pay.google.com/gp/v/save/${token}`;
}
