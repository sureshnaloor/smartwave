
import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";
import { ProfileData } from "@/app/_actions/profile";

export async function generateApplePass(user: ProfileData) {
    try {
        const certsDir = path.join(process.cwd(), "lib/wallet/certs");

        // Check if certificates exist
        const wwdrPath = path.join(certsDir, "wwdr.pem");
        const signerCertPath = path.join(certsDir, "signerCert.pem");
        const signerKeyPath = path.join(certsDir, "signerKey.pem");
        const password = process.env.APPLE_PASS_KEY_PASSWORD || "";

        if (!fs.existsSync(wwdrPath) || !fs.existsSync(signerCertPath) || !fs.existsSync(signerKeyPath)) {
            throw new Error("Apple Wallet certificates missing in lib/wallet/certs");
        }

        const wwdr = fs.readFileSync(wwdrPath);
        const signerCert = fs.readFileSync(signerCertPath);
        const signerKey = fs.readFileSync(signerKeyPath);

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
            serialNumber: user._id?.toString() || Math.random().toString(36).substring(7),
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
                key: "mobile",
                label: "MOBILE",
                value: user.mobile || "",
            },
            {
                key: "email",
                label: "EMAIL",
                value: user.workEmail || "",
            }
        );

        pass.backFields.push(
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
            message: user.shorturl ? `https://smartwave.app/p/${user.shorturl}` : `https://smartwave.app/profile/${user.userEmail}`,
            messageEncoding: "iso-8859-1",
            altText: "Scan to view profile"
        });

        return pass.getAsBuffer();
    } catch (error) {
        console.error("Error generating Apple Pass:", error);
        throw error;
    }
}
