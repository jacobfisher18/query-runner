# Electron App

A SQL Client desktop application built with Electron.

# Running Locally

```
yarn install
yarn start
```

# Releases

1. Bump the app version in package.json & push a commit with the change

2. Create draft release in GitHub releases

```
export GH_TOKEN=<INSERT_PERSONAL_ACCESS_TOKEN> && yarn dist
```

3. Publish the draft release

- Go to https://github.com/jacobfisher18/query-runner/releases
- Click on the draft release that was created
- Click "Publish release"
