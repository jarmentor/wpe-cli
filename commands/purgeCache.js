import fetch from 'node-fetch'

import { findTargetEnvironment, getAuthorization } from '../util.js'

async function purgeCache(environmentId, type = 'object') {
    const res = await fetch(
        `https://api.wpengineapi.com/v1/installs/${environmentId}/purge_cache`,
        {
            method: 'POST',
            body: JSON.stringify({
                type: type,
            }),
            headers: {
                Authorization: getAuthorization(),
                'Content-Type': 'application/json',
            },
        }
    )

    return [200, 202].includes(res.status)
        ? { success: true, environmentId, cachePurged: type }
        : { success: false, status: res.status, response: await res.json() }
}

const createMessage = async (resp, status, targetEnv, cachesPurged) => ({
    environment: targetEnv.at(0).name,
    operationStatus: status,
    cachesPurged,
    domain: targetEnv.at(0).primary_domain,
    resp,
})

export default async function purgeCacheByName(environmentName, options) {
    const targetEnv = await findTargetEnvironment.byName(environmentName)
    const cacheToPurge =
        options.type == 'all' ? ['page', 'object'] : [options.type]

    if (targetEnv.length == 0) {
        return console.log(`No environment with name ${environment} found.`)
    }

    if (targetEnv.length > 1) {
        return console.log(
            `Multiple environments found for name: ${environment}`,
            targetEnv
        )
    }

    cacheToPurge.forEach(async (cacheType) => {
        const resp = await purgeCache(targetEnv.at(0).id, cacheType)
        return console.log(
            resp.success
                ? await createMessage(resp, 'Success', targetEnv, cacheToPurge)
                : await createMessage(resp, 'Failed', targetEnv, cacheToPurge)
        )
    })
}
