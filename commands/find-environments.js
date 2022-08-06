import { inspect } from 'node:util'
import { getAllSites } from '../util.js'

export default async function findEnvironments(
    query = '*',
    { colors, ...options }
) {
    let sites = await getAllSites()
    const matches = sites.filter((site) => {
        if (
            query === '*' ||
            site.primary_domain.includes(query) ||
            site.name.includes(query)
        ) {
            // If we have options, filter by those options
            // Else just include the site as a match to the query
            return Object.keys(options).length === 0
                ? true
                : site.status == options.status ||
                      site.environment == options.type ||
                      site.php_version.includes(options.php)
        }
    })

    return console.log(
        inspect(matches, {
            maxArrayLength: null,
            colors,
        })
    )
}
