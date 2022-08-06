import fetch from 'node-fetch'
import {
    getAllSites,
    findTargetEnvironmentByName,
    getAuthorization,
} from '../util.js'

export default async function backup(environment, options, sites = null) {
    const targetEnv = await findTargetEnvironmentByName(environment, sites)

    if (targetEnv.length == 0) {
        return console.log(`No environment with name ${environment} found.`)
    }

    if (targetEnv.length > 1) {
        return console.log(
            `Multiple environments found for name: ${environment}`,
            targetEnv
        )
    }

    const res = await fetch(
        `https://api.wpengineapi.com/v1/installs/${targetEnv.at(0).id}/backups`,
        {
            method: 'POST',
            body: JSON.stringify({
                description: options.message,
                notification_emails: options.notificationEmails,
            }),
            headers: {
                Authorization: getAuthorization(),
                'Content-Type': 'application/json',
            },
        }
    )

    const wpeResponseJson = await res.json()

    return console.log({
        environment: targetEnv.at(0).name,
        domain: targetEnv.at(0).primary_domain,
        description: options.message,
        notify: options.notificationEmails,
        ...wpeResponseJson,
    })
}
