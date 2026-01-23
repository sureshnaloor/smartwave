
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import { ProfileData } from "@/app/_actions/profile";

export async function generateApplePass(user: ProfileData) {
    try {
        const certsDir = path.join(process.cwd(), "lib/wallet/certs");

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

        // Create a new pass
        const pass = new PKPass({}, {
            wwdr,
            signerCert,
            signerKey,
            signerKeyPassphrase: password,
        }, {
            organizationName: "SmartWave",
            description: `${user.name}'s Business Card`,
            foregroundColor: "rgb(255, 255, 255)",
            backgroundColor: "rgb(0, 0, 0)",
            labelColor: "rgb(200, 200, 200)",
            sharingProhibited: false,
            serialNumber: (user._id?.toString() || Math.random().toString(36).substring(7)) + "_v2",
        });

        // Set pass type
        pass.type = "generic";

        // Load images if they exist in the certs directory
        const iconPath = path.join(certsDir, "icon.png");
        const logoPath = path.join(certsDir, "logo.png");
        const stripPath = path.join(certsDir, "strip.png");

        if (fs.existsSync(iconPath)) pass.addBuffer("icon.png", fs.readFileSync(iconPath));
        if (fs.existsSync(logoPath)) pass.addBuffer("logo.png", fs.readFileSync(logoPath));
        if (fs.existsSync(stripPath)) pass.addBuffer("strip.png", fs.readFileSync(stripPath));

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
