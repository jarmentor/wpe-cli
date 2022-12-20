import { getAllSites, formatOutput } from '../util.js'

export default async function listSites({ colors }) {
    let sites = await getAllSites()
    return formatOutput(sites, colors)
}
