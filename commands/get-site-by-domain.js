import { getAllSites } from '../util.js'

export default async function getSiteByDomain(domains) {
    let sites = await getAllSites()

    const matches = []

    domains.map((domain) =>
        matches.push(
            ...sites.filter((site) => site.primary_domain.includes(domain))
        )
    )

    return console.dir(matches)
}