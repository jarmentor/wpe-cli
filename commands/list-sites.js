import fetch from 'node-fetch'
import { getAuthorization } from '../authorize.js'

export default async function listSites() {
    const getSites = async(
        url = 'https://api.wpengineapi.com/v1/installs'
    ) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: { Authorization: getAuthorization() },
        })
        return await res.json()
    }

    let res = await getSites()
    const sites = [...res.results]
    while (res.next) {
        res = await getSites(res.next)
        sites.push(...res.results)
    }
    return console.log(JSON.stringify(sites, null, 2))
        // return console.dir(sites, { depth: null })
}