# WPE-CLI

This is a super simple rudimentary cli for interacting with the [WP Engine API](https://wpengineapi.com/).

At present, it only gets information and outputs it to the console. It was built to satisfy a very specific need:

Given a domain, quickly obtaining the environment name for accessing it over ssh using a function like the one below

```bash
wpe-ssh () {
	ssh "$1@$1.ssh.wpengine.net"
}
```

---

## Basic install instructions

### Adding Credentials

First [generate your credentials](https://my.wpengine.com/api_access)

Then, add these to your profile. (e.g. `.zshrc`)

```bash
export WPENGINE_USER_ID="YOUR_API_USER_ID"
export WPENGINE_PASSWORD="YOUR_API_PASSWORD"
```

### Install Dependencies

-   `cd` into the package directory
-   run the following

```bash

npm install

```

### Link the package

-   still in the package directory
-   run the following

```bash
npm link
```

### Run the package

```bash
wpe help
```

## Basic uninstall instructions

```bash
npm r -g wpe-cli
```
