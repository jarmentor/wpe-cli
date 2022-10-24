import { getAllGroups } from '../util.js'

export default async function listGroups() {
    let sites = await getAllGroups()
    return console.log(JSON.stringify(sites, null, 2))
}
