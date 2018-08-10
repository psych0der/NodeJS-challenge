## NodeJS practice challenge
[![Build Status](https://travis-ci.org/psych0der/NodeJS-challenge.svg?branch=master)](https://travis-ci.org/psych0der/NodeJS-challenge)

This project contains 2 solved questions

#### Question 1:

Write a function called deepClone which takes an object and creates a copy of it. e.g. {name: "Paddy", address: {town: "Lerum", country: "Sweden"}} -> {name: "Paddy", address: {town: "Lerum", country: "Sweden"}}

#### Question 2:

We'd like to contact partners with offices within 100km of central London (coordinates 51.515419, -0.141099) to invite them out for a meal.

Write a NodeJS/JavaScript program that reads our list of partners (download partners.json here) and outputs the company names and addresses of matching partners (with offices within 100km) sorted by company name (ascending).

You can use the first formula from this Wikipedia article to calculate distance. Don't forget to convert degrees to radians! Your program should be fully tested too.

---

### Setup instructions

This project is implemented in NodeJS and tested on versions _v8_, _v9_ and _v10_

- Download all the files in this gist to a folder
  - In order to ease this step I have uploaded the folder structure to dropbox and can be downloaded from [here](https://www.dropbox.com/s/h5g852wkxgrzp5b/spidergap.zip?dl=0)
- To install dependencies(only testing packages, as can be checked from `package.json`) type `npm install`


- To run test cases, run `yarn run test`

#### Solutions are implemented as modules in the following files:

- **Question1**:
  - Source module: `getInviteCandidates` in `invitePartner.js`.
  - Driver file: `invitePartner-driver.js`
  - Test file: `test_invitePartner.js`
- **Question2**:
  - Source module: `deepClone` in `deepClone.js`.
  - Driver file: `deepClone-driver.js`
  - Test file: `test_deepClone.js`

> Driver files are a demo of module usage
