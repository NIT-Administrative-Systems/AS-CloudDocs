# Packages & Libraries
These packages are recommendations based on Administrative Systems' past successes. It covers the "big three" languages: JS, PHP, and Java.

These serve as a good set of "default" options for things. There may be use-cases where something else is better, but unless & until a justification can be made to use something else, you are encouraged to draw from this list. Using the same libraries will allow AS developers to transfer between projects more easily, as technical competencies developed in one project will be transferrable to other projects.

Please refer to each package's documentation for instructions on how to install, configure, and use it.

## Northwestern Libraries
This is a reference for all of the libraries Administrative Systems has created. You can use these in your applications to access Northwestern-specific functionality.

| Package                                                                                                | Language         | Purpose                     | 
|--------------------------------------------------------------------------------------------------------|------------------|-----------------------------| 
| [nusso](https://github.com/NIT-Administrative-Systems/nusso-node)                                      | NodeJS           | WebSSO                      | 
| [nusso express middleware](https://github.com/NIT-Administrative-Systems/ADO-SSO-node-express-example) | Express (NodeJS) | WebSSO                      | 
| [laravel-soa](https://nit-administrative-systems.github.io/SysDev-laravel-soa/)                        | Laravel (PHP)    | WebSSO, common API bindings | 
| [EventHub SDK](https://github.com/NIT-Administrative-Systems/SysDev-EventHub-PHP-SDK)                  | PHP              | EventHub API binding        | 
| [EventHub SDK](https://github.com/NIT-Administrative-Systems/ia-EventHub-Library)                      | Java             | EventHub API binding        | 
| [northwestern-laravel-ui](https://nit-administrative-systems.github.io/northwestern-laravel-ui)        | Laravel (PHP)    | Bootstrap 4 theme & layouts |
| [AS-serverless-api-IaC](https://github.com/NIT-Administrative-Systems/AS-serverless-api-IaC)           | Terraform        | Create infra for NodeJS API |

## Recommended Frontend Libraries
### UI Toolkits
There are three main UI toolkits to choose from: Bootstrap, Tailwind, and the NU department templates:

| Package                                                                                                | Language         | Purpose                         | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------| 
| [Bootstrap 4](https://getbootstrap.com/) <sup>*</sup>                                                  | jQuery, SCSS     | General purpose UI toolkit      |
| [Tailwind CSS](https://tailwindcss.com/)                                                               | CSS              | Bespoke website design          |
| [Northwestern Department Templates](https://www.northwestern.edu/templates/v3/)                        | SCSS             | Official NU theme               |
| [Font Awesome](https://fontawesome.com/)                                                               | *Agnostic*       | Icons                           |

<small><sup>*</sup> The `northwestern-laravel-ui` package for PHP contains an [NU Bootstrap theme](https://github.com/NIT-Administrative-Systems/northwestern-laravel-ui/tree/develop/src/Presets/northwestern-stubs) and starter templates.</small>

Bootstrap is a good 'default' choice for an application: it provides many ready-made UI elements, which will be consistent across all of our Bootstrap applications. 

The NU department templates have a smaller number of UI components available, but will yield a look similar to [northwestern.edu](https://northwestern.edu). 

Tailwind should only be chosen for bespoke designs. For example, the alumni dev team used Tailwind to replicate designs provided by the Alumni Relations & Development marketing group. Replicating those precise mockup designs in Bootstrap would have been impossible.

### Frontend Frameworks

| Package                                                                                                | Language         | Purpose                         | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------| 
| [jQuery](https://jquery.com/)                                                                          | JS               | Building rich UIs               |
| [Livewire](https://laravel-livewire.com/)                                                              | Laravel (PHP)    | Rich UI w/out writing jQuery/JS |
| [Vue](https://vuejs.org/)                                                                              | JS               | Application framework           |

### UI Components
These components have been used to great success in ADO's applications.

| Package                                                                                                | Language         | Purpose                                           | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------------| 
| [AutoNumeric](http://autonumeric.org/)                                                                 | JS               | Improved number input for forms, esp. for money   |
| [DataTables.net](https://datatables.net/)                                                              | JS (jQuery)      | Rich table UI w/ AJAX support                     |
| [bootstrap-datepicker](https://bootstrap-datepicker.readthedocs.io/en/latest/)                       | JS (jQuery)      | Date field w/ calendar pop-up                     |
| [bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)                         | JS (jQuery)      | Filterable `<select>` w/ great `multiple` support |
| [TinyMCE](https://www.tiny.cloud/)                                                                     | JS               | Rich text editor                                  |

## Recommended Backend Libraries
### Application Frameworks
The recommended framework largely depends on the problem you are trying to solve & the language you use to solve it.

| Package                                                                                                | Language         | Purpose                                           | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------------| 
| [Laravel](https://laravel.com/)                                                                        | PHP              | Framework for apps & APIs                         |
| [ExpressJS](https://expressjs.com/)                                                                    | NodeJS           | Framework for apps & APIs                         |
| [serverless-http for Express](https://github.com/dougmoscrop/serverless-http)                        | NodeJS (Express) | ExpressJS Lambda/API Gateway adapter              |
| [Spring Boot](https://spring.io/projects/spring-boot)                                                  | Java             | Framework for apps, APIs, integrations, & ETLs    |

More information on getting started with these frameworks can be found in the [Application Patterns](./app-patterns.md) article.

### General
| Package                                                                                                | Language         | Purpose                                           | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------------| 
| [moment.js](https://momentjs.com/)                                                                     | NodeJS           | DateTime & timezone manipulation                  |
| [Carbon](https://carbon.nesbot.com/docs/)                                                              | PHP              | DateTime & timezone manipulation                  |
| [libphonenumber](https://github.com/google/libphonenumber#third-party-ports)                           | *Agnostic*       | Validate & get info about phone numbers           |
| [Guzzle](https://docs.guzzlephp.org/en/stable/)                                                        | PHP              | HTTP client                                       |
| [Axios](https://github.com/axios/axios)                                                                | NodeJS           | HTTP Client                                       |


## Testing Frameworks
| Package                                                                                                | Language         | Purpose                                           | 
|--------------------------------------------------------------------------------------------------------|------------------|---------------------------------------------------| 
| [PHPUnit](https://phpunit.de/)                                                                         | PHP              | Unit & feature testing                            |
| [JUnit](https://junit.org/)                                                                            | Java             | Unit & feature testing                            |
| [Testbench](https://github.com/orchestral/testbench)                                                   | Laravel (PHP)    | Testing shim for Laravel packages                 |
| [Laravel Dusk](https://laravel.com/docs/8.x/dusk) (Selenium)                                           | Laravel (PHP)    | Functional & E2E testing                          |
| [Katalon Studio](https://www.katalon.com/katalon-studio/)                                              | *Agnostic*       | Functional & E2E testing                          |

:::warning JavaScript
There is currently no consensus on a JS testing framework. ADO has used the following successfully:

- [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), & [Istanbul](https://istanbul.js.org/)
- [Jest](https://jestjs.io/)
:::
