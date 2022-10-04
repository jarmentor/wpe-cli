#! /usr/bin/env node

import { program as wpeCLI } from 'commander'

import {
    listSites,
    findEnvironments,
    whoami,
    backup,
} from './commands/index.js'

import * as fs from 'fs'
const packageInfo = JSON.parse(fs.readFileSync('./package.json'))

wpeCLI
    .name('wpe')
    .description('Command Line Access to WP Engine')
    .version(packageInfo.version, '-v, --version', 'output the current version')

wpeCLI
    .command('list-sites')
    .description('Retrieve a list of all sites in WPE.')
    .action(listSites)

wpeCLI
    .command('find <searches...>')
    .description(
        'Retrieve a list of environments where the name or domain matches a search.'
    )
    .action((searches) => findEnvironments(searches))

wpeCLI
    .command('backup <environment>')
    .option('-m, --message [message]')
    .option('-n, --notification-emails [emails...]')
    .description('Trigger a backup on an arbitrary environment by name.')
    .action((environment, options) => backup(environment, options))

wpeCLI
    .command('whoami')
    .description('Retrieve the current user.')
    .action(whoami)

wpeCLI.parse(process.argv)
