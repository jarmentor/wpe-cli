import { getAllSites } from '../util.js'

/**
 * Find environments whose name or primary domain match one or more search terms.
 * If the query is '*', all sites are returned.
 *
 * @param {string|string[]} query Single search term or array of terms.
 * @param {object} options Additional filter options (currently unused).
 */
export default async function findEnvironments(query, options = {}) {
    const sites = await getAllSites()

    const searches = Array.isArray(query) ? query : [query]
    if (searches.length === 1 && searches[0] === '*') {
        return console.dir(sites)
    }

    const matches = []
    for (const term of searches) {
        matches.push(
            ...sites.filter(
                (site) =>
                    site.primary_domain.includes(term) ||
                    site.name.includes(term)
            )
        )
    }

    return console.dir(matches)
}
