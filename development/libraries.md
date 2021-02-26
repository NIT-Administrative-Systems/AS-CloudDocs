# Packages & Libraries
This is a reference for all of the libraries Administrative Systems has created. You can use these in your applications. 

Please refer to each package's documentation for instructions on how to install, configure, and use it.

| Package                                                                                                | Language         | Purpose                     | 
|--------------------------------------------------------------------------------------------------------|------------------|-----------------------------| 
| [nusso](https://github.com/NIT-Administrative-Systems/nusso-node)                                      | NodeJS           | WebSSO                      | 
| [nusso express middleware](https://github.com/NIT-Administrative-Systems/ADO-SSO-node-express-example) | Express (NodeJS) | WebSSO                      | 
| [laravel-soa](https://nit-administrative-systems.github.io/SysDev-laravel-soa/)                        | Laravel (PHP)    | WebSSO, common API bindings | 
| [EventHub SDK](https://github.com/NIT-Administrative-Systems/SysDev-EventHub-PHP-SDK)                  | PHP              | EventHub API binding        | 
| [EventHub SDK](https://github.com/NIT-Administrative-Systems/ia-EventHub-Library)                      | Java             | EventHub API binding        | 
| [northwestern-laravel-ui](https://nit-administrative-systems.github.io/northwestern-laravel-ui)        | Laravel (PHP)    | Bootstrap 4 theme & layouts |
| [AS-serverless-api-IaC](https://github.com/NIT-Administrative-Systems/AS-serverless-api-IaC)           | Terraform        | Create infra for NodeJS API |

## Contributing
If you have a library developed at Northwestern that should be included here, please submit a pull request.

When developing a new library, the best practices are:

- Following [semantic versioning](https://semver.org/)
- Including a CHANGELOG file
- Publishing your package on that language's package repository (Packagist for PHP, NPM for NodeJS, GitHub Packages for Java/Maven)
- Including documentation - perhaps with a VuePress docs site that includes lots of examples & use-cases
- Writing thorough unit tests
- Use GitHub Actions to run the test suite on all supported versions of the language

For Laravel packages, you should make use of the [Testbench library](https://github.com/orchestral/testbench) to shim out framework features.
