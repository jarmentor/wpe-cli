#! /usr/bin/env node

import { program as wpeCLI } from 'commander'
import listSites from './commands/list-sites.js'
import getSiteByDomain from './commands/get-site-by-domain.js'
import whoami from './commands/whoami.js'

wpeCLI.name('wpe')
wpeCLI.description('Command Line Access to WP Engine')

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