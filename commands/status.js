import fetch from 'node-fetch'

export default async function getStatus() {
    const res = await fetch(`https://api.wpengineapi.com/v1/status`)
    const json = await res.json()
    json.status = json.success ? 'OK' : 'NOT OK'
    return formatOutput(json)
}
