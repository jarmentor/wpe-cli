export function getAuthorization() {
    const WPENGINE_PASSWORD = process.env.WPENGINE_PASSWORD
    const WPENGINE_USER_ID = process.env.WPENGINE_USER_ID
    const auth_string = Buffer.from(
        `${WPENGINE_USER_ID}:${WPENGINE_PASSWORD}`
    ).toString('base64')
    return `Basic ${auth_string}`
}