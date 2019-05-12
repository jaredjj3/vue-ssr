import Vue from 'vue';
import Foo from './views/FooView.vue';
import { createStore } from './store';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  return new Promise((resolve, reject) => {
    const store = createStore();

    context.rendered = () => {
      context.state = store.state;
    };

    const app = new Vue({
      store,
      render: (createElement) => createElement(Foo, {
        attrs: {
          class: context.componentName.toLowerCase(),
        },
      }),
    });

    resolve(app);
  });
};
