# Frontend Stacks
Any application with a frontend benefits from the recommendations in this article.

:::tip The Administrative Systems Seal of Approval
These recommendations in this article serve as a good set of "default" options for things.

There may be use-cases where something else is better, but unless & until a justification can be made to use something else, you should draw from this list. 

Using the same libraries will allow AS developers to transfer between projects more easily, as technical competencies developed in one project will be transferrable to other projects.
:::

## CSS Frameworks
There are three main CSS frameworks to choose from: Bootstrap, Tailwind, and the NU department templates:

| Package                                                                         | Language         | Purpose                         | 
|---------------------------------------------------------------------------------|------------------|---------------------------------| 
| [Bootstrap 4](https://getbootstrap.com/)                                        | SCSS, jQuery     | General purpose UI toolkit      |
| [Tailwind CSS](https://tailwindcss.com/)                                        | CSS              | Bespoke website design          |
| [Northwestern Department Templates](https://www.northwestern.edu/templates/v3/) | SCSS             | Official NU theme               |

Bootstrap is a good 'default' choice for an application: it provides many ready-made UI elements, which will be consistent across all of our Bootstrap applications. 

The NU department templates have a smaller number of UI components available, but will yield a look similar to [northwestern.edu](https://northwestern.edu). 

Tailwind should only be chosen for bespoke designs. For example, the alumni dev team used Tailwind to replicate designs provided by the Alumni Relations & Development marketing group. Replicating those precise mockup designs in Bootstrap would have been impossible.

## Frontend Frameworks
There are a number of frontend JavaScript frameworks available.

| Package                                   | Language      | Purpose                              | 
|-------------------------------------------|---------------|--------------------------------------| 
| *None*                                    | JS            | Simple apps may not need a framework |
| [Vue](https://vuejs.org/)                 | JS            | Application framework                |
| [jQuery](https://jquery.com/)             | JS            | Building rich UIs                    |
| [Livewire](https://laravel-livewire.com/) | Laravel (PHP) | Rich UI w/out writing JavaScript     |

If your frontend needs are simple, consider vanilla JavaScript. A few form field dependencies or a single AJAX call likely do not merit bringing an entire framework into your frontend.

When your needs are more complex, Vue is the framework of choice. Vue is the recommendation for single-page applications (SPAs).

When working with our [Laravel stack](./laravel-stack.md), Livewire is the "frontend" framework of choice, despite being a backend component.

### Phasing Out jQuery
The use of jQuery in your application should be phased out. 

jQuery served an important role as a cross-browser adapter & enhancement to what JavaScript functions were available to developers. In this current era, browser support for JavaScript language features is consistent, and enhancements have been made to the language that make many of jQuery's features redundant. This change will be reflected by Bootstrap in the upcoming v5 release.

There may still be UI components that depend on jQuery. Many of the Bootstrap 4-themed UI components (like [`bootstrap-select`](https://developer.snapappointments.com/bootstrap-select/)) rely on jQuery. This is a reasonable design choice for them in the Bootstrap 4 era, since Bootstrap itself depends on jQuery. You can continue to use these libraries -- the directive is to *phase jQuery out*, not that developers are forbidden from using it.

## UI Widgets
These are ready-made UI widgets like form controls.

| Package                                                                                                | Type       | Purpose                                           | 
|--------------------------------------------------------------------------------------------------------|------------|---------------------------------------------------| 
| [AutoNumeric](http://autonumeric.org/)                                                                 | Vanilla JS | Improved number input for forms, esp. for money   |
| [DataTables.net](https://datatables.net/)                                                              | jQuery     | Rich table UI w/ AJAX support                     |
| [bootstrap-datepicker](https://bootstrap-datepicker.readthedocs.io/en/latest/)                         | jQuery     | Date field w/ calendar pop-up                     |
| [bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)                           | jQuery     | Filterable `<select>` w/ great `multiple` support |
| [TinyMCE](https://www.tiny.cloud/)                                                                     | Vanilla JS | Rich text editor                                  |
| [Font Awesome](https://fontawesome.com/)                                                               | CSS        | Icons                                             |