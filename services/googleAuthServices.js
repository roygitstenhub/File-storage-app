import { OAuth2Client } from "google-auth-library";

const clientId = "882451240551-rk4edevg5of1a7qlddot3tcgrmiuuf47.apps.googleusercontent.com"

const client = new OAuth2Client({ clientId })

export async function verifyIdToken(idToken) {
    const loginTicket = await client.verifyIdToken({
        idToken,
        audience: clientId,
    })

    const userData = loginTicket.getPayload()
    return userData
}