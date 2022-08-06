import { inspect } from 'node:util'
import { getAllSites } from '../util.js'

export default async function listSites() {
    let sites = await getAllSites()
    return console.log(
        inspect(sites, {
            maxArrayLength: null,
            colors: options.colors,
        })
    )
}
