import fetch from 'node-fetch'
import { getAllSites, getAuthorization } from '../util.js'

export default async function backup(environment, options) {
    const sites = await getAllSites()

    const targetEnv = sites.filter((site) => site.name == environment)

    if (targetEnv.length == 0) {
        return console.log(`No environment with name ${environment} found.`)
    }

    if (targetEnv.length > 1) {
        return console.log(
            `Multiple environments found for name: ${environment}`,
            targetEnv
        )
    }

    const request_body = {
        description: options.message,
        notification_emails: options.notificationEmails,
    }

    const res = await fetch(
        `https://api.wpengineapi.com/v1/installs/${targetEnv[0].id}/backups`,
        {
            method: 'POST',
            body: JSON.stringify(request_body),
            headers: {
                Authorization: getAuthorization(),
                'Content-Type': 'application/json',
            },
        }
    )

    const json = await res.json()

    return console.log(json)
}
