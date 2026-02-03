
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import { ProfileData } from "@/app/_actions/profile";
import { AdminPass } from "@/lib/admin/pass";

export async function generateApplePass(user: ProfileData, host?: string, passData?: AdminPass) {
    try {
        const certsDir = path.join(process.cwd(), "lib/wallet/certs");
        const imageDir = path.join(process.cwd(), "public/wallet");

        // Check if certificates exist as files or in environment variables
        let wwdr, signerCert, signerKey;

        const wwdrPath = path.join(certsDir, "wwdr.pem");
        const signerCertPath = path.join(certsDir, "signerCert.pem");
        const signerKeyPath = path.join(certsDir, "signerKey.pem");
        const password = process.env.APPLE_PASS_KEY_PASSWORD || "";

        if (fs.existsSync(wwdrPath)) {
            wwdr = fs.readFileSync(wwdrPath);
        } else if (process.env.APPLE_WWDR_CERT_BASE64) {
            wwdr = Buffer.from(process.env.APPLE_WWDR_CERT_BASE64, 'base64');
        }

        if (fs.existsSync(signerCertPath)) {
            signerCert = fs.readFileSync(signerCertPath);
        } else if (process.env.APPLE_SIGNER_CERT_BASE64) {
            signerCert = Buffer.from(process.env.APPLE_SIGNER_CERT_BASE64, 'base64');
        }

        if (fs.existsSync(signerKeyPath)) {
            signerKey = fs.readFileSync(signerKeyPath);
        } else if (process.env.APPLE_SIGNER_KEY_BASE64) {
            signerKey = Buffer.from(process.env.APPLE_SIGNER_KEY_BASE64, 'base64');
        }

        if (!wwdr || !signerCert || !signerKey) {
            throw new Error("Apple Wallet certificates missing (not found as files or environment variables)");
        }

        // Helper to convert Buffer to string and extract pure PEM block
        const toPemString = (buf: Buffer | string) => {
            const str = buf.toString();
            // Look for Certificate blocks
            const certMatch = str.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
            if (certMatch) return certMatch[0];

            // Look for Private Key blocks (including RSA specific or PKCS#8)
            const keyMatch = str.match(/-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA )?PRIVATE KEY-----/);
            if (keyMatch) return keyMatch[0];

            return buf;
        };

        // Prepare certificates
        const certificates = {
            wwdr: toPemString(wwdr),
            signerCert: toPemString(signerCert),
            signerKey: toPemString(signerKey),
            ...(password ? { signerKeyPassphrase: password } : {}),
        };

        const certInfo = (name: string, buf: Buffer | string) => {
            const str = buf.toString();
            const hasPem = str.includes("-----BEGIN");
            return `${name}: ${hasPem ? "PEM detected" : "No PEM block"} (starts with: ${str.substring(0, 40).replace(/\n/g, "\\n")}...)`;
        };

        console.log("Certificate diagnostics:");
        console.log("- " + certInfo("WWDR", wwdr));
        console.log("- " + certInfo("SignerCert", signerCert));
        console.log("- " + certInfo("SignerKey", signerKey));

        // Use a stable ID base from user ID or email hash
        const userId = user._id?.toString() || Buffer.from(user.userEmail).toString('hex').substring(0, 12);

        // Determine serial number: User-Specific or Pass-Specific
        const serialNumber = passData ? `${userId}_${passData._id}` : userId;

        // Use a stable serial number and authentication token for updates
        const authenticationToken = process.env.APPLE_PASS_AUTH_TOKEN || "smartwave_secret_token_" + serialNumber;

        // For production, ALWAYS use www.smartwave.name to avoid redirects from smartwave.name to www.smartwave.name
        // because Apple Wallet strips the Authorization header on redirects.
        let baseUrl = 'https://www.smartwave.name';

        if (host && host.includes("localhost")) {
            baseUrl = `http://${host}`;
        } else if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("smartwave.name")) {
            // Fallback for other environments (preview branches etc)
            baseUrl = process.env.NEXTAUTH_URL.replace(/\/$/, "");
        }

        const rawWebServiceURL = `${baseUrl}/api/wallet`;

        // IMPORTANT: Apple Wallet updates ONLY work over HTTPS. 
        const webServiceURL = rawWebServiceURL.startsWith('https') ? rawWebServiceURL : undefined;

        if (!webServiceURL) {
            console.warn(`[Apple Pass] webServiceURL SKIPPED (not HTTPS): ${rawWebServiceURL}`);
        } else {
            console.log(`[Apple Pass] webServiceURL INCLUDED: ${webServiceURL}`);
        }

        // Create a new pass – modern dark theme with clean typography
        const pass = new PKPass({}, certificates as any, {
            organizationName: user.company || "SmartWave",
            logoText: passData ? "Event Pass" : "Digital Card",
            description: passData ? passData.name : `${user.name}'s Business Card`,
            foregroundColor: "rgb(255, 255, 255)",
            backgroundColor: "rgb(0, 0, 0)",
            labelColor: "rgb(160, 160, 165)",
            sharingProhibited: false,
            serialNumber: serialNumber,
            passTypeIdentifier: "pass.com.smartwave.card",
            teamIdentifier: "943Y3M5QVZ",
            ...(webServiceURL ? { webServiceURL, authenticationToken } : {}),
        });

        // Load images
        const imageNames = ["icon.png", "logo.png", "strip.png", "icon@2x.png", "logo@2x.png", "strip@2x.png", "icon@3x.png", "logo@3x.png", "strip@3x.png"];

        let companyLogoBuffer: Buffer | null = null;
        if (!passData && user.companyLogo) {
            // Only load company logo for profile pass, or maybe also for event pass? 
            // Currently existing logic loads it for profile pass.
            try {
                const response = await fetch(user.companyLogo);
                if (response.ok) {
                    companyLogoBuffer = Buffer.from(await response.arrayBuffer());
                    console.log("- Successfully fetched company logo");
                }
            } catch (err) {
                console.error("Could not fetch company logo:", err);
            }
        }

        console.log("Loading images from:", imageDir);
        for (const name of imageNames) {
            const imgPath = path.join(imageDir, name);
            if (name.startsWith("logo") && companyLogoBuffer) {
                // Use fetched company logo instead of disk logo
                pass.addBuffer(name, companyLogoBuffer);
                console.log(`- Added company logo buffer for ${name}`);
            } else if (fs.existsSync(imgPath)) {
                console.log(`- Added image from disk: ${name}`);
                pass.addBuffer(name, fs.readFileSync(imgPath));
            } else if (name === "icon.png") {
                console.error(`- CRITICAL: Missing required image: ${name} at ${imgPath}`);
            }
        }

        if (passData) {
            pass.type = "eventTicket";

            // Primary: Event Name
            pass.primaryFields.push({
                key: "event",
                label: "EVENT",
                value: passData.name,
            });

            // Secondary: Location & Date
            if (passData.location) {
                pass.secondaryFields.push({
                    key: "location",
                    label: "LOCATION",
                    value: passData.location.name,
                });

                // Add lat/long if available
                if (passData.location.lat && passData.location.lng) {
                    pass.setLocations({
                        latitude: passData.location.lat,
                        longitude: passData.location.lng,
                        relevantText: `Welcome to ${passData.name}`
                    });
                }
            }

            if (passData.dateStart) {
                const d = new Date(passData.dateStart);
                pass.secondaryFields.push({
                    key: "date",
                    label: "DATE",
                    value: d,
                });

                pass.secondaryFields[pass.secondaryFields.length - 1].dateStyle = "PKDateStyleMedium";
                pass.secondaryFields[pass.secondaryFields.length - 1].timeStyle = "PKDateStyleShort";

                // Set relevantDate for the pass
                pass.setRelevantDate(d);
            }

            // Auxiliary: User Name (Ticket Holder)
            pass.auxiliaryFields.push({
                key: "holder",
                label: "TICKET HOLDER",
                value: user.name,
            });

            // Barcode for event pass - point to official website as placeholder
            pass.setBarcodes({
                format: "PKBarcodeFormatQR",
                message: "https://www.smartwave.name",
                messageEncoding: "iso-8859-1",
                altText: "Scan to visit SmartWave"
            });

        } else {
            // ----- PROFILE PASS LOGIC -----
            pass.type = "generic";

            // branding
            pass.headerFields.push({
                key: "brand",
                value: "SmartWave",
            });

            // User photo
            if (user.photo) {
                try {
                    const response = await fetch(user.photo);
                    if (response.ok) {
                        const photoBuffer = Buffer.from(await response.arrayBuffer());
                        pass.addBuffer("thumbnail.png", photoBuffer);
                    }
                } catch (err) {
                    console.error("Could not load user photo for pass thumbnail:", err);
                }
            }

            // Fields
            pass.primaryFields.push({
                key: "name",
                label: "NAME",
                value: user.name,
            });

            pass.secondaryFields.push({
                key: "title",
                label: "JOB TITLE",
                value: user.title || "",
            });
            pass.secondaryFields.push({
                key: "company",
                label: "COMPANY",
                value: user.company || "",
            });

            pass.auxiliaryFields.push(
                {
                    key: "workPhone",
                    label: "WORK",
                    value: user.workPhone || "",
                },
                {
                    key: "mobile",
                    label: "MOBILE",
                    value: user.mobile || "",
                },
                {
                    key: "workEmail",
                    label: "EMAIL",
                    value: user.workEmail || "",
                }
            );

            // Back fields
            pass.backFields.push(
                {
                    key: "web_app",
                    label: "Open in Browser",
                    value: "https://www.smartwave.name",
                    dataDetectorTypes: ["PKDataDetectorTypeLink" as const],
                },
                {
                    key: "mobile_app",
                    label: "Get the App · Coming Soon",
                    value: "https://www.smartwave.name/app",
                    dataDetectorTypes: ["PKDataDetectorTypeLink" as const],
                },
                {
                    key: "workEmailBack",
                    label: "Work Email",
                    value: user.workEmail || "",
                },
                {
                    key: "personalEmail",
                    label: "Personal Email",
                    value: user.personalEmail || "",
                },
                {
                    key: "companyBack",
                    label: "Company",
                    value: user.company || "",
                },
                {
                    key: "website",
                    label: "Website",
                    value: user.website || "",
                    ...(user.website ? { dataDetectorTypes: ["PKDataDetectorTypeLink" as const] } : {}),
                },
                {
                    key: "linkedin",
                    label: "LinkedIn",
                    value: user.linkedin || "",
                    ...(user.linkedin ? { dataDetectorTypes: ["PKDataDetectorTypeLink" as const] } : {}),
                }
            );

            // Barcode
            pass.setBarcodes({
                format: "PKBarcodeFormatQR",
                message: user.shorturl ? `https://smartwave.name/publicprofile/${user.shorturl}` : `https://smartwave.name/profile/${user.userEmail}`,
                messageEncoding: "iso-8859-1",
                altText: "Scan to view profile"
            });
        }

        const passBuffer = await pass.getAsBuffer();
        console.log(`[Apple Pass] Generated buffer of size: ${passBuffer.length}`);
        return passBuffer;
    } catch (error) {
        console.error("Error generating Apple Pass:", error);
        throw error;
    }
}
