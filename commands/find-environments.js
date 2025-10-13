import { getAllSites } from '../util.js'

/**
 * Find environments whose name or primary domain match one or more search terms.
 * If the query is '*', all sites are returned.
 *
 * @param {string|string[]} query Single search term or array of terms.
 * @param {object} options Additional filter options: type, status, php.
 */
export default async function findEnvironments(query, options = {}) {
    const sites = await getAllSites()

    const searches = Array.isArray(query) ? query : [query]

    // Filter by search terms
    let matches
    if (searches.length === 1 && searches[0] === '*') {
        matches = sites
    } else {
        // Use Set to avoid duplicates when multiple terms match the same site
        const matchSet = new Set()
        for (const term of searches) {
            sites
                .filter(
                    (site) =>
                        site.primary_domain.includes(term) ||
                        site.name.includes(term)
                )
                .forEach((site) => matchSet.add(site))
        }
        matches = Array.from(matchSet)
    }

    // Apply additional filters
    if (options.type) {
        matches = matches.filter(
            (site) => site.environment === options.type
        )
    }
    if (options.status) {
        matches = matches.filter((site) => site.status === options.status)
    }
    if (options.php) {
        matches = matches.filter((site) => site.php_version === options.php)
    }

    return console.dir(matches)
}
