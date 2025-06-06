#! /usr/bin/env node
process.removeAllListeners("warning");

import { program as wpeCLI } from "commander";

import {
  listSites,
  listGroups,
  findEnvironments,
  whoami,
  backup,
} from "./commands/index.js";

wpeCLI.name("wpe").description("Command Line Access to WP Engine");

wpeCLI
  .command("list-sites")
  .description("Retrieve a list of all sites in WPE.")
  .action(listSites);
wpeCLI
  .command("list-groups")
  .description("Retrieve a list of all sites in WPE.")
  .action(listGroups);

wpeCLI
  .command("find <searches...>")
  .description(
    "Retrieve a list of environments where the name or domain matches a search.",
  )
  .action((searches) => findEnvironments(searches));

wpeCLI
  .command("backup <environments...>")
  .option("-m, --message [message]")
  .option("-n, --notification-emails [emails...]")
  .description("Trigger a backup on an arbitrary environments by name.")
  .action((environments, options) => {
    environments.map((environment) => backup(environment, options));
  });

wpeCLI
  .command("whoami")
  .description("Retrieve the current user.")
  .action(whoami);

wpeCLI.parse(process.argv);
