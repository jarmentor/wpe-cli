#! /usr/bin/env node

import { program as wpeCLI } from 'commander'

import {
    listSites,
    whoami,
    backup,
    purgeCacheByName,
    status,
    findEnvironments,
} from './commands/index.js'

import * as fs from 'fs'
const { version } = JSON.parse(fs.readFileSync('./package.json'))

wpeCLI
    .name('wpe')
    .description('Command Line Access to WP Engine')
    .version(version)

wpeCLI
    .command('list-sites')
    .option('--no-colors', 'output non-colorized')
    .description('Retrieve a list of all sites in WPE.')
    .action((options) => listSites(options))

wpeCLI
    .command('find-environments')
    .argument(
        '[query]',
        'query string searches environment name or associated domain; partial matches allowed',
        '*'
    )
    .option('-t, --type [type]', 'Type of Environment')
    .option('-s, --status [status]', 'Status of environment')
    .option('--no-colors', 'output non-colorized')
    .option('--php [version]', 'PHP Version of the environment')
    .description('Retrieve a list of environments matching a query')
    .action((query, options) => findEnvironments(query, options))

wpeCLI
    .command('backup <environments...>')
    .requiredOption('-m, --message [message]')
    .option('--no-colors', 'output non-colorized')
    .requiredOption('-n, --notification-emails [emails...]')
    .description('Trigger a backup on an arbitrary environment.')
    .action(async (environments, options) => {
        const { getAllSites } = await import('./util.js')
        const sites = await getAllSites()
        environments.forEach((env) => backup(env, options, sites))
    })

wpeCLI
    .command('purge-cache <environment>')
    .option('-t, --type [type]', 'type of cache to be purged', 'object')
    .description('Purge the WPE cache for an arbitrary environment.')
    .action((environment, options) => {
        purgeCacheByName(environment, options)
    })

wpeCLI
    .command('status')
    .description('Retrieve the status of the WPE Public API.')
    .action(status)

wpeCLI
    .command('whoami')
    .description('Retrieve the current user.')
    .action(whoami)

wpeCLI.parse(process.argv)
