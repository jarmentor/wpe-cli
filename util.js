import fetch from 'node-fetch'

export function getAuthorization() {
    const { WPENGINE_PASSWORD, WPENGINE_USER_ID } = process.env
    const auth_string = Buffer.from(
        `${WPENGINE_USER_ID}:${WPENGINE_PASSWORD}`
    ).toString('base64')
    return `Basic ${auth_string}`
}

async function getSites(url = 'https://api.wpengineapi.com/v1/installs') {
    const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })
    return await res.json()
}

export async function getAllSites() {
    let res = await getSites()
    const sites = [...res.results]
    while (res.next) {
        res = await getSites(res.next)
        sites.push(...res.results)
    }
    return sites
}
