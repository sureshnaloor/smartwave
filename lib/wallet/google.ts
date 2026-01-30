
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { ProfileData } from "@/app/_actions/profile";

function getCredentials() {
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
    const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT;
    let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

    if (privateKey) {
        // Handle quotes, escaped newlines, and literal newlines.
        privateKey = privateKey
            .replace(/^["'](.+)["']$/, '$1')
            .replace(/\\n/g, '\n')
            .trim();

        // Ensure it starts with the correct header if it's missing or mangled
        if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") && !privateKey.includes("-----BEGIN RSA PRIVATE KEY-----")) {
            console.warn("[Google Wallet] Private key seems to be missing PEM headers.");
        }
    }

    if (!issuerId || !serviceAccountEmail || !privateKey || privateKey.length < 50) {
        throw new Error("Google Wallet credentials missing or invalid");
    }

    return { issuerId, serviceAccountEmail, privateKey };
}

function createWalletObject(user: ProfileData, issuerId: string) {
    const classId = process.env.GOOGLE_WALLET_CLASS_ID || "SmartWaveGenericClass";

    // Ensure we have a stable ID. Use MongoDB ID if available, otherwise a stable hash of the email.
    const userIdentifier = user._id?.toString() || Buffer.from(user.userEmail).toString('hex').substring(0, 12);
    const objectId = `${issuerId}.${userIdentifier}`;

    // Cache-busting for images - append a timestamp if available
    const timeTag = user.updatedAt ? new Date(user.updatedAt).getTime() : Date.now();
    const addCacheBuster = (url: string) => {
        if (!url) return url;
        try {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}v=${timeTag}`;
        } catch (e) {
            return url;
        }
    };

    return {
        id: objectId,
        classId: `${issuerId}.${classId}`,
        genericType: "GENERIC_TYPE_UNSPECIFIED",
        barcode: {
            type: "QR_CODE",
            value: user.shorturl ? `https://www.smartwave.name/publicprofile/${user.shorturl}` : `https://www.smartwave.name/profile/${user.userEmail}`,
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
                uri: addCacheBuster(user.companyLogo)
            }
        } : undefined,
        heroImage: user.photo ? {
            sourceUri: {
                uri: addCacheBuster(user.photo)
            }
        } : undefined,
        textModulesData: [
            { header: "Company", body: user.company || "N/A", id: "company" },
            { header: "Work Phone", body: user.workPhone || "N/A", id: "work_phone" },
            { header: "Mobile", body: user.mobile || "N/A", id: "mobile" },
            { header: "Work Email", body: user.workEmail || "N/A", id: "work_email" },
            { header: "Personal Email", body: user.personalEmail || "N/A", id: "personal_email" }
        ],
        linksModuleData: {
            uris: [
                {
                    uri: "https://www.smartwave.name",
                    description: "SmartWave Web App (Sign up/Profile)",
                    id: "web_app_link"
                },
                {
                    uri: "https://www.smartwave.name/app",
                    description: "Get the SmartWave App (Coming Soon)",
                    id: "phone_app_link"
                }
            ]
        },
        // Adding a message can help trigger a sync/notification on the device
        messages: [
            {
                header: "Card Updated",
                body: `Your digital card was updated on ${new Date(user.updatedAt || Date.now()).toLocaleDateString()}`,
                id: "update_notification"
            }
        ]
    };
}

export function generateGoogleWalletUrl(user: ProfileData) {
    const { issuerId, serviceAccountEmail, privateKey } = getCredentials();
    const walletObject = createWalletObject(user, issuerId);

    const payload = {
        iss: serviceAccountEmail,
        aud: "google",
        typ: "savetowallet",
        iat: Math.floor(Date.now() / 1000),
        payload: {
            genericObjects: [walletObject]
        }
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return `https://pay.google.com/gp/v/save/${token}`;
}

export async function updateGoogleWalletObject(user: ProfileData) {
    try {
        const { issuerId, serviceAccountEmail, privateKey } = getCredentials();
        const walletObject = createWalletObject(user, issuerId);

        const auth = new google.auth.JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
        });

        // Diagnostic log (safe) - Helps verify if credentials are even present
        const keySnippet = privateKey.substring(0, 30).replace(/\n/g, '\\n');
        console.log(`[Google Wallet] JWT Auth initializing. Key starts with: ${keySnippet}...`);

        const walletobjects = google.walletobjects({ version: 'v1' });

        console.log(`[Google Wallet] Updating ID: ${walletObject.id} for user: ${user.name}`);

        // Perform the update call, explicitly passing the auth object
        const response = await walletobjects.genericobject.update({
            resourceId: walletObject.id,
            requestBody: walletObject,
            auth: auth as any // Explicitly pass auth to the method call
        });

        console.log("[Google Wallet] API Response Status:", response.status);
        return { success: true };
    } catch (error: any) {
        console.error("[Google Wallet] Update failed.");
        if (error.response) {
            console.error("- Status:", error.response.status);
            console.error("- Data:", JSON.stringify(error.response.data, null, 2));

            // If the object doesn't exist yet (404), that's expected if the user hasn't added it.
            if (error.response.status === 404) {
                console.log("[Google Wallet] Object not found. This is normal if the user hasn't saved the pass yet.");
                return { success: true, warning: "Object not found" };
            }
        } else {
            console.error("- Error message:", error.message);
        }
        return { success: false, error };
    }
}
