
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { ProfileData } from "@/app/_actions/profile";
import { AdminPass } from "@/lib/admin/pass";

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

function createWalletObject(user: ProfileData, issuerId: string, passData?: AdminPass, baseUrl?: string) {
    const classId = process.env.GOOGLE_WALLET_CLASS_ID || "SmartWaveGenericClass";
    const appBaseUrl = baseUrl || "https://www.smartwave.name";

    // Ensure we have a stable ID. Use MongoDB ID if available.
    const userIdentifier = user._id?.toString() || Buffer.from(user.userEmail).toString('hex').substring(0, 12);

    // GOOGLE WALLET ID LIMIT: 64 characters total
    let objectId = "";
    if (passData) {
        const passIdStr = passData._id?.toString() || "event";
        const shortUserId = userIdentifier.substring(userIdentifier.length - 10);
        objectId = `${issuerId}.${shortUserId}_${passIdStr}`;
    } else {
        objectId = `${issuerId}.${userIdentifier}`;
    }

    // Cache-busting for images
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

    // If it's for an event/access pass, map those fields
    if (passData) {
        const passUrl = `${appBaseUrl}/passes/${passData._id}`;
        return {
            id: objectId,
            classId: `${issuerId}.${classId}`,
            genericType: "GENERIC_TYPE_UNSPECIFIED",
            barcode: {
                type: "QR_CODE",
                value: "https://www.smartwave.name",
                alternateText: "Scan to visit SmartWave"
            },
            cardTitle: {
                defaultValue: {
                    language: "en-US",
                    value: "SmartWave Pass"
                }
            },
            header: {
                defaultValue: {
                    language: "en-US",
                    value: passData.name
                }
            },
            subheader: {
                defaultValue: {
                    language: "en-US",
                    value: passData.location?.name || "SmartWave Event"
                }
            },
            logo: user.companyLogo ? {
                sourceUri: { uri: addCacheBuster(user.companyLogo) }
            } : undefined,
            // User requested to STOP showing user photo on passes to avoid confusion
            heroImage: undefined,
            textModulesData: [
                { header: "Pass Holder", body: user.name, id: "holder" },
                { header: "Event Date", body: passData.dateStart ? new Date(passData.dateStart).toLocaleString() : "TBA", id: "date" },
                { header: "Type", body: passData.type.toUpperCase(), id: "type" },
                { header: "Email", body: user.userEmail, id: "email" }
            ],
            linksModuleData: {
                uris: [
                    {
                        uri: passUrl,
                        description: "View Pass Details Online",
                        id: "details_link"
                    }
                ]
            }
        };
    }

    // Default: Business Card
    const profileUrl = user.shorturl ? `${appBaseUrl}/publicprofile/${user.shorturl}` : `${appBaseUrl}/profile/${user.userEmail}`;
    return {
        id: objectId,
        classId: `${issuerId}.${classId}`,
        genericType: "GENERIC_TYPE_UNSPECIFIED",
        barcode: {
            type: "QR_CODE",
            value: profileUrl,
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
                value: [user.title, user.company].filter(Boolean).join(" · ") || "User"
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
            { header: "Work Phone", body: user.workPhone || "N/A", id: "work_phone" },
            { header: "Mobile", body: user.mobile || "N/A", id: "mobile" },
            { header: "Work Email", body: user.workEmail || "N/A", id: "work_email" },
            { header: "Personal Email", body: user.personalEmail || "N/A", id: "personal_email" }
        ],
        linksModuleData: {
            uris: [
                {
                    uri: appBaseUrl,
                    description: "SmartWave Web App (Sign up/Profile)",
                    id: "web_app_link"
                },
                {
                    uri: `${appBaseUrl}/app`,
                    description: "Get the SmartWave App (Coming Soon)",
                    id: "phone_app_link"
                }
            ]
        },
        messages: [
            {
                header: "Card Updated",
                body: `Your digital card was updated on ${new Date(user.updatedAt || Date.now()).toLocaleDateString()}`,
                id: "update_notification"
            }
        ]
    };
}

export function generateGoogleWalletUrl(user: ProfileData, passData?: AdminPass, host?: string) {
    const { issuerId, serviceAccountEmail, privateKey } = getCredentials();

    // Determine the base URL for links and barcodes
    const baseUrl = process.env.MOBILE_GOOGLE_CALLBACK_BASE
        || (host ? `${host.includes('localhost') ? 'http' : 'https'}://${host}` : "https://www.smartwave.name");

    const walletObject = createWalletObject(user, issuerId, passData, baseUrl);

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

export async function updateGoogleWalletObject(user: ProfileData, passData?: AdminPass, host?: string) {
    try {
        const { issuerId, serviceAccountEmail, privateKey } = getCredentials();
        const baseUrl = process.env.MOBILE_GOOGLE_CALLBACK_BASE
            || (host ? `${host.includes('localhost') ? 'http' : 'https'}://${host}` : "https://www.smartwave.name");

        const walletObject = createWalletObject(user, issuerId, passData, baseUrl);

        const auth = new google.auth.JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
        });

        const walletobjects = google.walletobjects({ version: 'v1' });

        const response = await walletobjects.genericobject.update({
            resourceId: walletObject.id,
            requestBody: walletObject,
            auth: auth as any
        });

        return { success: true };
    } catch (error: any) {
        // 404 is expected when the user hasn't added the pass to their wallet yet
        if (error.response?.status === 404) {
            return { success: true, warning: "Object not found" };
        }
        console.error("[Google Wallet] Update failed:", error.response?.status ?? error.message);
        return { success: false, error };
    }
}
