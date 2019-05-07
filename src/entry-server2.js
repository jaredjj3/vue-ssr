import Foo from './views/FooView.vue';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  console.log(context);
  return new Vue({
    render: (h) => h(Foo),
  });
};
