import { getAllSites } from '../util.js'
import { spawn } from 'child_process'

/**
 * Open WPEngine admin panel for environment by name or domain
 *
 * @param {string} query Environment name or domain to search for
 */
export default async function open(query) {
    const sites = await getAllSites()
    
    const matches = sites.filter(
        (site) =>
            site.primary_domain.includes(query) ||
            site.name.includes(query)
    )
    
    if (matches.length === 0) {
        console.error(`No environments found for "${query}".`)
        process.exit(1)
    }
    
    const environment = matches[0]
    if (matches.length > 1) {
        console.warn(
            `Multiple environments matched "${query}". Using first: ${environment.name}`
        )
    }
    
    const url = `https://my.wpengine.com/installs/${environment.name}`
    console.log(`Opening ${url}`)
    
    // Open URL in default browser
    const command = process.platform === 'darwin' ? 'open' : 
                   process.platform === 'win32' ? 'start' : 'xdg-open'
    
    spawn(command, [url], { stdio: 'inherit' })
}