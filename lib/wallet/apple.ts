
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import { ProfileData } from "@/app/_actions/profile";

export async function generateApplePass(user: ProfileData) {
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

        // Log certificate formats for debugging (first 30 chars)
        console.log("Certificate diagnostics:");
        console.log("- WWDR starts with:", wwdr.toString().substring(0, 30).replace(/\n/g, "\\n"));
        console.log("- SignerCert starts with:", signerCert.toString().substring(0, 30).replace(/\n/g, "\\n"));
        console.log("- SignerKey starts with:", signerKey.toString().substring(0, 30).replace(/\n/g, "\\n"));

        // Create a new pass
        const pass = new PKPass({}, certificates as any, {
            organizationName: user.company || "SmartWave",
            logoText: "Digital Card",
            description: `${user.name}'s Business Card`,
            foregroundColor: "rgb(255, 255, 255)",
            backgroundColor: "rgb(0, 0, 0)",
            labelColor: "rgb(200, 200, 200)",
            sharingProhibited: false,
            serialNumber: `${user._id?.toString() || Math.random().toString(36).substring(7)}_${Date.now()}`,
            passTypeIdentifier: "pass.com.smartwave.card",
            teamIdentifier: "943Y3M5QVZ",
        });

        // Set pass type
        pass.type = "generic";

        // Fetch company logo first if available
        let companyLogoBuffer: Buffer | null = null;
        if (user.companyLogo) {
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

        // Load images
        const imageNames = ["icon.png", "logo.png", "strip.png", "icon@2x.png", "logo@2x.png", "strip@2x.png", "icon@3x.png", "logo@3x.png", "strip@3x.png"];

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

        // Add SmartWave branding to the top right (header field)
        pass.headerFields.push({
            key: "brand",
            value: "SmartWave",
        });

        // Use user's photo as thumbnail if available
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

        // Add fields using getters
        pass.primaryFields.push({
            key: "name",
            label: "NAME",
            value: user.name,
        });

        pass.secondaryFields.push({
            key: "title",
            label: "TITLE",
            value: user.title || "",
        });

        pass.auxiliaryFields.push(
            {
                key: "workPhone",
                label: "WORK PHONE",
                value: user.workPhone || "",
            },
            {
                key: "mobile",
                label: "MOBILE",
                value: user.mobile || "",
            }
        );

        pass.backFields.push(
            {
                key: "workEmail",
                label: "WORK EMAIL",
                value: user.workEmail || "",
            },
            {
                key: "personalEmail",
                label: "PERSONAL EMAIL",
                value: user.personalEmail || "",
            },
            {
                key: "company",
                label: "COMPANY",
                value: user.company || "",
            },
            {
                key: "website",
                label: "WEBSITE",
                value: user.website || "",
            },
            {
                key: "linkedin",
                label: "LINKEDIN",
                value: user.linkedin || "",
            }
        );

        // Set barcodes
        pass.setBarcodes({
            format: "PKBarcodeFormatQR",
            message: user.shorturl ? `https://smartwave.name/publicprofile/${user.shorturl}` : `https://smartwave.name/profile/${user.userEmail}`,
            messageEncoding: "iso-8859-1",
            altText: "Scan to view profile"
        });

        return pass.getAsBuffer();
    } catch (error) {
        console.error("Error generating Apple Pass:", error);
        throw error;
    }
}
