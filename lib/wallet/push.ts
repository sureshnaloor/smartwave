import apn from "node-apn";
import path from "path";
import fs from "fs";
import { getRegistrationsByUser, updateRegistrationsTimestamp } from "./db";

export async function sendApplePushNotification(userEmail: string) {
    try {
        const registrations = await getRegistrationsByUser(userEmail);
        if (registrations.length === 0) {
            console.log(`[Apple Push] No registered devices for user: ${userEmail}`);
            return;
        }

        // Update timestamps so that when the device asks for updates, it finds the record
        await updateRegistrationsTimestamp(userEmail);

        const certsDir = path.join(process.cwd(), "lib/wallet/certs");
        const signerKeyPath = path.join(certsDir, "signerKey.pem");
        const signerCertPath = path.join(certsDir, "signerCert.pem");

        let key: any, cert: any;

        if (fs.existsSync(signerKeyPath) && fs.existsSync(signerCertPath)) {
            key = fs.readFileSync(signerKeyPath);
            cert = fs.readFileSync(signerCertPath);
        } else if (process.env.APPLE_SIGNER_KEY_BASE64 && process.env.APPLE_SIGNER_CERT_BASE64) {
            key = Buffer.from(process.env.APPLE_SIGNER_KEY_BASE64, 'base64');
            cert = Buffer.from(process.env.APPLE_SIGNER_CERT_BASE64, 'base64');
        } else {
            console.error("[Apple Push] Certificates missing for push notification");
            return;
        }

        const options = {
            cert: cert,
            key: key,
            passphrase: process.env.APPLE_PASS_KEY_PASSWORD || "",
            production: true // Apple Wallet certificates are typically production-type, even in development
        };

        const apnProvider = new apn.Provider(options);

        console.log(`[Apple Push] Sending notifications to ${registrations.length} devices for ${userEmail}`);

        const notification = new apn.Notification();
        notification.payload = {}; // Apple Wallet push notifications are empty
        notification.topic = "pass.com.smartwave.card"; // Must match your passTypeIdentifier

        for (const reg of registrations) {
            try {
                const result = await apnProvider.send(notification, reg.pushToken);
                console.log(`[Apple Push] Sent to device ${reg.deviceId}:`, result);
            } catch (err) {
                console.error(`[Apple Push] Failed for device ${reg.deviceId}:`, err);
            }
        }

        apnProvider.shutdown();
    } catch (error) {
        console.error("[Apple Push] Error in push notification service:", error);
    }
}
