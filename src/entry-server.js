import Vue from 'vue';
import { createStore } from './store';
import getComponent from './components/getComponent';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  return new Promise((resolve) => {
    const store = context.getStore(createStore);
    const component = getComponent(context.componentName);

    if (!component) {
      return resolve(
          new Vue({
            store,
            template: `<div></div>`,
          })
      );
    }

    const attrs = {};
    if (context.id) {
      attrs.id = context.id.toString();
    }

    const app = new Vue({
      store,
      render: (createElement) => createElement(component, {
        attrs,
        props: context.props,
      }),
    });

    resolve(app);
  });
};
