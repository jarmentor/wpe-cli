import fetch from 'node-fetch'
import fs from 'fs'
import os from 'os'
import path from 'path'

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes
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
    return res.json()
}

async function getGroups(url = 'https://api.wpengineapi.com/v1/sites') {
    const res = await fetch(url, {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })
    return res.json()
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
    let res = await getSites()
    const sites = [...res.results]
    while (res.next) {
        res = await getSites(res.next)
        sites.push(...res.results)
    }
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
    let res = await getGroups()
    const groups = [...res.results]
    while (res.next) {
        res = await getGroups(res.next)
        groups.push(...res.results)
    }
    await writeCache(cacheName, groups)
    return groups
}
