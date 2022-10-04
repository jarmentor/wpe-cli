import fetch from 'node-fetch'
import { getAuthorization } from '../util.js'

export async function getWhoAmI() {
    const res = await fetch('https://api.wpengineapi.com/v1/user', {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })

    const json = await res.json()
    return json
}

export default async function whoami() {
    const whoIAm = getWhoAmI()
    return console.dir(whoIAm)
}
