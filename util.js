import fetch from 'node-fetch'
import fs from 'fs'
import os from 'os'
import path from 'path'

const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours
const CACHE_DIR = process.env.XDG_CACHE_HOME
    ? path.join(process.env.XDG_CACHE_HOME, 'wpe-cli')
    : path.join(os.homedir(), '.cache', 'wpe-cli')

/**
 * Get the file path for a named cache.
 * @param {string} name Name of the cache file (without extension)
 * @returns {string} Path to the cache file
 */
function getCacheFilePath(name) {
    return path.join(CACHE_DIR, `${name}.json`)
}

/**
 * Read a JSON cache if it exists and is still valid.
 * @param {string} name Name of the cache file
 * @returns {Promise<any|null>} Parsed data or null if missing/expired
 */
async function readCache(name) {
    const filePath = getCacheFilePath(name)
    try {
        const raw = await fs.promises.readFile(filePath, 'utf8')
        const { timestamp, data } = JSON.parse(raw)
        if (Date.now() - timestamp < CACHE_TTL) {
            return data
        }
    } catch {
        // ignore missing or invalid cache
    }
    return null
}

/**
 * Write data to a named JSON cache.
 * @param {string} name Name of the cache file
 * @param {any} data Data to cache
 * @returns {Promise<void>}
 */
async function writeCache(name, data) {
    const filePath = getCacheFilePath(name)
    try {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
        const payload = JSON.stringify({ timestamp: Date.now(), data })
        await fs.promises.writeFile(filePath, payload, 'utf8')
    } catch {
        // ignore cache write errors
    }
}

/**
 * Get WP Engine API authorization header.
 * @returns {string} Basic auth header
 */
export function getAuthorization() {
    const { WPENGINE_PASSWORD, WPENGINE_USER_ID } = process.env
    const authString = Buffer.from(
        `${WPENGINE_USER_ID}:${WPENGINE_PASSWORD}`
    ).toString('base64')
    return `Basic ${authString}`
}

async function getSites(url = 'https://api.wpengineapi.com/v1/installs') {
    const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })
    if (!res.ok) {
        throw new Error(
            `WP Engine API error: ${res.status} ${res.statusText}`
        )
    }
    return res.json()
}

async function getGroups(url = 'https://api.wpengineapi.com/v1/sites') {
    const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })
    if (!res.ok) {
        throw new Error(
            `WP Engine API error: ${res.status} ${res.statusText}`
        )
    }
    return res.json()
}

/**
 * Fetch all pages from a paginated WP Engine API endpoint in parallel.
 * Makes one initial request to get the total count, then fetches remaining pages concurrently.
 *
 * @param {Function} fetchFn The fetch function to use (getSites or getGroups)
 * @param {string} baseUrl The base API URL
 * @param {number} pageSize Number of items per page (default: 100)
 * @returns {Promise<any[]>} Array of all items from all pages
 */
async function fetchAllPaginated(fetchFn, baseUrl, pageSize = 100) {
    // Make initial request to get count and first page
    const firstPage = await fetchFn(`${baseUrl}?limit=${pageSize}`)
    const { count, results } = firstPage

    // If all results fit in first page, return immediately
    if (results.length >= count) {
        return results
    }

    // Calculate how many additional pages we need
    const totalPages = Math.ceil(count / pageSize)
    const remainingPages = totalPages - 1

    // Generate URLs for all remaining pages
    const pageUrls = Array.from(
        { length: remainingPages },
        (_, i) => `${baseUrl}?limit=${pageSize}&offset=${(i + 1) * pageSize}`
    )

    // Fetch all remaining pages in parallel
    const remainingResults = await Promise.all(
        pageUrls.map(url => fetchFn(url).then(res => res.results))
    )

    // Combine first page with all other pages
    return results.concat(...remainingResults)
}

/**
 * Retrieve all site instances, using a local cache to reduce network calls.
 * Cache entries expire after a fixed TTL.
 * @returns {Promise<any[]>} Array of site objects
 */
export async function getAllSites() {
    const cacheName = 'sites'
    const cached = await readCache(cacheName)
    if (cached) {
        return cached
    }
    const sites = await fetchAllPaginated(
        getSites,
        'https://api.wpengineapi.com/v1/installs'
    )
    await writeCache(cacheName, sites)
    return sites
}

/**
 * Retrieve all site groups, using a local cache to reduce network calls.
 * Cache entries expire after a fixed TTL.
 * @returns {Promise<any[]>} Array of group objects
 */
export async function getAllGroups() {
    const cacheName = 'groups'
    const cached = await readCache(cacheName)
    if (cached) {
        return cached
    }
    const groups = await fetchAllPaginated(
        getGroups,
        'https://api.wpengineapi.com/v1/sites'
    )
    await writeCache(cacheName, groups)
    return groups
}

/**
 * Utility for locating target environments by partial name or domain.
 */
export const findTargetEnvironment = {
    /**
     * Find environments whose name or primary domain includes the given search term.
     * @param {string} searchName Partial environment name or domain.
     * @returns {Promise<any[]>} Matching site objects.
     */
    byName: async (searchName) => {
        const sites = await getAllSites()
        return sites.filter(
            (site) =>
                site.name.includes(searchName) ||
                site.primary_domain.includes(searchName)
        )
    },
}
