# WPE-CLI

## Usage:

1. Generate your API Credentials in your WP Engine [API Access Settings](https://my.wpengine.com/api_access)

2. Set the following environment variables in your profile (for example `~/.zshrc`, `~/.bash_profile`, or `~/.bashrc`)

```bash
export WPENGINE_USER_ID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
export WPENGINE_PASSWORD="XXXXXXXXXXXXXXXXXXXXXXX"
```

3. Run the command line utility via `npx`

```bash
npx jarmentor/wpe-cli
```

## Description

This is a super simple rudimentary command line interface for interacting with WP Engine's services through the [WP Engine API](https://wpengineapi.com/). This CLI is **not** a full implementation of that spec.

At present it supports the following actions:

-   triggering a backup on an array of environments
-   fetching details of an environment by partial domain or environment name
-   listing all environments

## Motivation

This thing was purpose built for the following cases: - given a domain, quickly obtaining environment details to:

-   accessing it over ssh using a function like this

```bash
wpe-ssh () {
	ssh "$1@$1.ssh.wpengine.net"
}
```

-   quickly access it in WPE via `https://my.wpengine.com/installs/{ENVIRONMENT_NAME}`

-   or quickly triggering a backup an environment by name

## Roadmap / Todo

-   [ ] Cache clearing functionality
-   [ ] Interactive interface for performing bulk actions through [inquirer.js](https://www.npmjs.com/package/inquirer)
