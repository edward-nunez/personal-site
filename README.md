# Personal Website

This is my personal website front end interface built with `React.js` and served on Express.js.

URL: [https://edwardnunez.io](https://edwardnunez.io)

## Local Setup

### Build

```bash
npm install

# Create the package lock files, needed for server workspace to build in docker.
npm --workspace=server install --package-lock-only
npm --workspace=client install --package-lock-only
```
