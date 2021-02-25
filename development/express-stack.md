# ExpressJS Stack
[Express](https://expressjs.com/) is the most popular web framework for Node. It can be [adapted to run on Lambda](https://github.com/dougmoscrop/serverless-http), making this easy to run locally for development or on AWS for production.

## Getting Started
A template with an included IaC module for deploying to AWS is available [in the Northwestern github organization](https://github.com/NIT-Administrative-Systems/AS-serverless-nodejs-api). This template is suitable for a microservice project.

You can create a new repository using this template from GitHub's new repository page.

## Stack
Express is a minimalistic framework. It does not bring its own opinions about libraries & design patterns to the table, leaving these up to the developer. Below are the libraries that are recommended for various purposes. When applicable to an application, these should be used.

:::tip The Administrative Systems Seal of Approval
These serve as a good set of "default" options for things.

There may be use-cases where something else is better, but unless & until a justification can be made to use something else, you should draw from this list. 

Using the same libraries will allow AS developers to transfer between projects more easily, as technical competencies developed in one project will be transferrable to other projects.
:::

| Package                                                                                                | Purpose                              | 
|--------------------------------------------------------------------------------------------------------|--------------------------------------| 
| AWS Lambda                                                                                             | Platform                             |
| AWS DynamoDB                                                                                           | Document DB, session store, cache    |
| PostgreSQL *(available as Aurora Serverless RDS for PostgreSQL on AWS)*                                | Relational DB                        |
| [nusso](https://github.com/NIT-Administrative-Systems/nusso-node)                                      | WebSSO                               | 
| [nusso express middleware](https://github.com/NIT-Administrative-Systems/ADO-SSO-node-express-example) | WebSSO                               | 
| [serverless-http for Express](https://github.com/dougmoscrop/serverless-http)                          | ExpressJS Lambda/API Gateway adapter |
| [Font Awesome](https://fontawesome.com/)                                                               | Icons                                |
| [moment.js](https://momentjs.com/)                                                                     | DateTime & timezone manipulation     |
| [libphonenumber](https://github.com/google/libphonenumber#third-party-ports)                           | Phone number info & validation       |
| [Axios](https://github.com/axios/axios)                                                                | HTTP client                          |
| [node-oracledb](https://github.com/oracle/node-oracledb) <sup>*</sup>                                  | Oracle DB driver                     |

<small><sup>*</sup> See the [section below](#oracle-on-aws-lambda) on setting up the Oracle driver.</small>

There is currently no consensus on a JS testing framework. ADO has used the following successfully:

- [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), & [Istanbul](https://istanbul.js.org/)
- [Jest](https://jestjs.io/)

## Oracle on AWS Lambda
Oracle provides a node package wrapping their driver. Setting it up is not difficult, but it is more involved than a simple `yarn add`.

1. Create a `lib/` folder, get [the Oracle basic instant client for Linux](https://www.oracle.com/database/technologies/instant-client/downloads.html), and unzip it.

    The `lib/` folder should have several `.so` files in it now.

1. Add the highlighted `directories` section below to your `package.json`:

    ```json{5-7}
    {
        "name": "demo-project",
        "version": "0.0.1",
        // etc etc
        "directories": {
            "lib": "lib"
        },
    }
    ```

1. Add the [`oracledb` package](https://github.com/oracle/node-oracledb) as a dependency
     - Yarn will build the C++ extension against the instant client libs

1. Add some env vars to the run scripts in the `package.json` so the app looks for for the Oracle libs in `lib/`:

    `cross-env PATH=\"$PATH:./lib\" LD_LIBRARY_PATH=\"./lib\" nodemon -L ./bin/www`

    This example is launching the app with `nodemon`, but the command after the two env variables depends on how you are running your code.
    
1. Check the Linux `lib/` into git

    MacOS & Windows users could run this locally by adding their platform's Oracle drivers. It is not advisable to add the instantclient for Windows or MacOS to git, as the files are very large.

    > If you are on Windows or Mac, you will need to download the basic instant client zip file. On Windows, you can unpack it into the lib/ folder. On Mac, you will need to unpack it to ~/lib, outside of the project directory. On both operating systems, it should be automatically detected when you run the app.

