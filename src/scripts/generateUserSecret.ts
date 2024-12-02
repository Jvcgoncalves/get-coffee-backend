import crypto from "crypto"

export default function generateUserSecret(baseSecret: string, userId: string, email: string) {
  return crypto
    .createHmac('sha256', baseSecret) // Use HMAC with SHA-256
    .update(userId + email)           // Combine user ID and salt
    .digest('hex');                  // Output the derived secret as a hex string
}