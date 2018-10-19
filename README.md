# My Personal Website Front End

This is my personal website front end interface built with `React.js` and served on Express.js. This single page application consumes and posts data to my RESTful API at [edwardnunez.io-restapi](https://github.com/dotRollen/edwardnunez.io-restapi). I use this website to display my portfolio and build neat tools that I like to share with friends and family.

## Local Setup
### Requirements
The application was built with the following environment dependencies.

| Software        | Version           | Link  |
| ------------- |:-------------:| -----:|
| Node.js | ^10.8.0 | [Documentation](https://nodejs.org/dist/latest-v10.x/docs/api/) |
| Yarn | ^1.10.1 | [Documentation](https://yarnpkg.com/en/docs/usage) |

### Deploying

Currently, deploying the application is very simple and quick! First step is to clone the repository with `git clone`.

Then run `yarn installDeps` to install all dependencies for the express server and the `/client` React.js directory. There are a few options to running the application. 

> Please note that the app requires internet connection or a local setup deployment of the RESTful API service. 

#### Build & Run with Express Server

First option is to run the current build with out changes. This will take the existing React.js source code and build it to static files for Express to serve.

1. `yarn build`
2. `yarn start server`

#### Run Development Client Service

Use this option to run React.js in a development environment with out using Express.

1. `yarn client`

#### Run Development Client and Express Server

Entirely optional, you can run both the development React.js client with Express server. Use this for developing new features on the backend. Such as routes, adding a database and then setting up react to consome that data from Express via API or other.

1. `yarn start`