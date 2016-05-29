# e2e4

[![Build Status](https://travis-ci.org/fshchudlo/e2e4.svg?branch=master)](https://travis-ci.org/fshchudlo/e2e4)
[![Coverage Status](https://coveralls.io/repos/github/fshchudlo/e2e4/badge.svg?branch=master)](https://coveralls.io/github/fshchudlo/e2e4?branch=master)
[![Dependency Status](https://david-dm.org/fshchudlo/e2e4.svg)](https://david-dm.org/fshchudlo/e2e4)
[![devDependency Status](https://david-dm.org/fshchudlo/e2e4/dev-status.svg)](https://david-dm.org/fshchudlo/e2e4#info=devDependencies)

Set of base classes and utilities to build unobtrusive list models. 
This library is used as abstract codebase to implement bridges from client side frameworks [Angular](https://angular.io/) and [Aurelia](http://www.aurelia.io/)

## How to build the project

To build the project, follow these steps:
1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. Ensure that [TypeScript](http://www.typescriptlang.org/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g typescript
  ```
3. Ensure that [Typings](https://github.com/typings/typings/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g typings
  ```
4. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
5. From the project folder, execute the following command to install project dependencies:

  ```shell
  npm install
  ```
6. From the project folder, execute the following command to build the source code:

  ```shell
  gulp build
  ```
7. You will find the compiled code in the dist folder in following module formats: AMD, CommonJS, SystemJS and ES6.

## How to run tests

1. You can run tests in chrome with watch mode by executing the following command: 
  ```shell
  gulp test
  ```
or execute single run in PhantomJS:
  ```shell
  gulp test-single-run
  ```