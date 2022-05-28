import fetch from 'node-fetch'
import { getAuthorization } from '../authorize.js'

export default async function whoami() {
    const res = await fetch('https://api.wpengineapi.com/v1/user', {
        method: 'GET',
        headers: { Authorization: getAuthorization() },
    })

    const json = await res.json()
    return console.dir(json)
}