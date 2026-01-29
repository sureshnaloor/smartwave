
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { ProfileData } from "@/app/_actions/profile";

function getCredentials() {
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
    const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT;
    let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

    if (privateKey) {
        privateKey = privateKey.replace(/^["'](.+)["']$/, '$1').replace(/\\n/g, '\n');
    }

    if (!issuerId || !serviceAccountEmail || !privateKey || privateKey.length < 50) {
        throw new Error("Google Wallet credentials missing or invalid");
    }

    return { issuerId, serviceAccountEmail, privateKey };
}

function createGenericObject(user: ProfileData, issuerId: string) {
    const classId = process.env.GOOGLE_WALLET_CLASS_ID || "SmartWaveGenericClass";

    // Ensure we have a stable ID. Use MongoDB ID if available, otherwise a stable hash of the email.
    const userIdentifier = user._id?.toString() || Buffer.from(user.userEmail).toString('hex').substring(0, 12);
    const objectId = `${issuerId}.${userIdentifier}`;

    return {
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
                value: "SmartWave"
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
            { header: "Work Phone", body: user.workPhone || "N/A", id: "work_phone" },
            { header: "Mobile", body: user.mobile || "N/A", id: "mobile" },
            { header: "Work Email", body: user.workEmail || "N/A", id: "work_email" },
            { header: "Personal Email", body: user.personalEmail || "N/A", id: "personal_email" }
        ]
    };
}

export function generateGoogleWalletUrl(user: ProfileData) {
    const { issuerId, serviceAccountEmail, privateKey } = getCredentials();
    const genericObject = createGenericObject(user, issuerId);

    const payload = {
        iss: serviceAccountEmail,
        aud: "google",
        typ: "savetowallet",
        iat: Math.floor(Date.now() / 1000),
        payload: {
            genericObjects: [genericObject]
        }
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return `https://pay.google.com/gp/v/save/${token}`;
}

export async function updateGoogleWalletObject(user: ProfileData) {
    try {
        const { issuerId, serviceAccountEmail, privateKey } = getCredentials();
        const genericObject = createGenericObject(user, issuerId);

        const auth = new google.auth.JWT(
            serviceAccountEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/wallet_object.issuer']
        );

        const walletobjects = google.walletobjects({ version: 'v1', auth });

        console.log(`[Google Wallet] Patching ID: ${genericObject.id} for user: ${user.name} (${user.company || 'No Company'})`);

        const response = await walletobjects.genericObject.patch({
            resourceId: genericObject.id,
            requestBody: genericObject
        });

        console.log("[Google Wallet] API Response Status:", response.status);
        return { success: true };
    } catch (error: any) {
        console.error("[Google Wallet] Update failed.");
        if (error.response) {
            console.error("- Status:", error.response.status);
            console.error("- Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("- Error message:", error.message);
        }
        return { success: false, error };
    }
}
