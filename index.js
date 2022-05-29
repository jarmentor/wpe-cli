#! /usr/bin/env node

import { program as wpeCLI } from 'commander'

import { listSites, getSiteByDomain, whoami } from './commands/index.js'

import * as fs from 'fs'
const packageInfo = JSON.parse(fs.readFileSync('./package.json'))

wpeCLI
    .name('wpe')
    .description('Command Line Access to WP Engine')
    .version(packageInfo.version)
    .storeOptionsAsProperties()

wpeCLI
    .command('list-sites')
    .description('Retrieve a list of all sites in WPE.')
    .action(listSites)

wpeCLI
    .command('find-environments <domains...>')
    .description('Retrieve a list of environments matching a domain search.')
    .action((domains) => getSiteByDomain(domains))

wpeCLI
    .command('whoami')
    .description('Retrieve the current user.')
    .action(whoami)

wpeCLI.parse(process.argv)