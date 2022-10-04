import { getAllSites } from '../util.js'

export default async function findEnvironments(searches) {
    let sites = await getAllSites()
    const matches = []

    searches.map((search) =>
        matches.push(
            ...sites.filter(
                (site) =>
                    site.primary_domain.includes(search) ||
                    site.name.includes(search)
            )
        )
    )
    return console.dir(matches)
}
