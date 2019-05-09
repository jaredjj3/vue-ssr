import Vue from 'vue';
import Foo from './views/FooView.vue';
import { createStore } from './store';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  const store = createStore();
  console.log(context);
  return new Vue({
    store,
    render: (h) => h(Foo),
  });
};
