import { getAllSites } from '../util.js'

export default async function listSites() {
    let sites = await getAllSites()
    return console.log(JSON.stringify(sites, null, 2))
}