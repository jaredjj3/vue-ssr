# vue-ssr

The purpose of this project is to gain an understanding of how to render Vue
components on the server side.

## Running

First, run `yarn` to install the dependencies for the project. Next, run `yarn build`. After that process exits, run `yarn dev` to start a `nodemon` process. You should be able to visit `http://localhost:8080` to view the project.

*NB* - There is no proper dev server for this project. You can run `yarn watch` to rebuild the bundles whenever files in the `src` directory change and run `yarn dev` as a separate process. However, some objects are loaded into memory and require a manual server restart. It is recommended to create a dev server solution, which is provided in the *Vue SSR production ready example* in the **Resources** section. There also may be packages that achieve this functionality as well.

## Features

method | endpoint | usage
--- | --- | ---
GET | `/` | Redirects to `/foo`
GET | `/foo` | Sets the value of `foo` in the store to the return of `process.env.VUE_ENV` ('server' or 'client')
GET | `/bar` | Sets the value of `bar` in the store to the return of `process.env.VUE_ENV` ('server' or 'client')
GET | `/baz` | Sets the value of `baz` in the store to the return of `process.env.VUE_ENV` ('server' or 'client')
GET | `/templates/:templateName?msg=msg` | Renders mustache template by the name of `templateName` and renders msg using Handlebars

`/`, `/foo`, `/bar`, `/baz` are examples of classic Vue SSR approach. In the long term, this will be the primary (and hopefully only) way to render pages.

`/templates/:templateName` is an example of a custom hybrid Vue-in-Handlebars SSR approach. This allows a codebase that mainly uses Handlebars to incrementally introduce Vue components into mustache templates. In the short term, this will be the primary way to render pages.

When a mustache template consists of only Vue components, it is a good candidate to be converted to a page component.

## Resources

- [General Vue SSR Guide](https://ssr.vuejs.org)
- [Vue SSR production ready example](https://github.com/vuejs/vue-hackernews-2.0)
- [Vue Server Render Context API (1/2)](https://ssr.vuejs.org/api/#template)
- [Vue Server Render Context API (2/2)](https://ssr.vuejs.org/guide/build-config.html#manual-asset-injection)
