import fetch from 'node-fetch'

export function getAuthorization() {
    const { WPENGINE_USER_ID, WPENGINE_PASSWORD } = process.env
    const authString = Buffer.from(`${WPENGINE_USER_ID}:${WPENGINE_PASSWORD}`)
    return `Basic ${authString.toString('base64')}`
}

export const findTargetEnvironment = {
    byName: async function (environmentName, sites = null) {
        let allSites = sites === null ? await getAllSites() : sites
        return allSites.filter(({ name }) => name == environmentName)
    },
    byDomain: async function (domain, sites = null) {
        let allSites = sites === null ? await getAllSites() : sites
        return allSites.filter(({ primary_domain }) =>
            primary_domain.includes(domain)
        )
    },
}
export function findTargetEnvironmentByName(environmentName, sites) {
    return findTargetEnvironment.byName(environmentName, sites)
}

export function findTargetEnvironmentByDomain(domain, sites) {
    return findTargetEnvironment.byDomain(domain, sites)
}

export function formatOutput(obj) {
    return JSON.stringify(obj, null, 2)
}

async function getSites(endpoint = 'https://api.wpengineapi.com/v1/installs') {
    const res = await fetch(endpoint, {
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
