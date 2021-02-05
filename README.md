
<h1 align="center">Toybox API / Fullstack Typescript Demo</h1>

<table style="margin-left:auto;margin-right:auto">
    <tr>
        <td vlign="center"><a href="https://github.com/jaredhanson/passport/" target="blank"><img src="https://bestofjs.org/logos/passport.svg" width="65" alt="Passport Logo" /></a></td>
        <td vlign="center"><a href="http://https://www.openapis.org/" target="blank"><img src="https://community.cdn.kony.com/sites/default/files/icon-open-api-swagger.png" width="105" alt="Open API Initiative (OAI) Logo" /></a></td>
        <td vlign="center"><a href="http://nestjs.com/" target="blank"><img src="https://seeklogo.com/images/N/nestjs-logo-09342F76C0-seeklogo.com.png" width="65" alt="Nest Logo" /></a></td>
        <td vlign="center"><a href="http://mongodb.com/" target="blank"><img src="https://github.com/mongodb-js/leaf/blob/master/dist/mongodb-leaf_256x256.png?raw=true" width="70" alt="MongoDB Logo" /></a></td>
    </tr>
</table>

<!--
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>-->

## Description

Toybox API uses the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.  See [toybox-web](http://github.com/abcox/toybox-web) for web client using [vuetify](http://vuetifyjs.com).

## Prerequisites
- [mongodb](https://docs.mongodb.com/guides/server/install/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Client Generation
Delete folder 'api/cient' and all contents
Generate the api/client
```
npm run gencli
```
Add file .eslintignore, and add:
```
/*.*
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

None

## Contact

- Author - [Adam Cox](http://linkedin.com/in/adamcox27)

## License

None

## Support
1. Issue during build of API results in no changes: [SO](nestjs SwaggerDocumentOptions github)
    ```
    npm run prebuild
    ```