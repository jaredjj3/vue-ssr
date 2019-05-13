import 'es6-promise/auto';
import Vue from 'vue';
import { createStore } from './store';
import getComponent from './components/getComponent';

const store = createStore();

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.hasOwnProperty('__INITIAL_STATE__')) {
  store.replaceState(window.__INITIAL_STATE__);
}

// wait until router has resolved all async before hooks
// and async components...
if (window.hasOwnProperty('__HYDRATION_SPECS__')) {
  for (const spec of window.__HYDRATION_SPECS__) {
    const component = getComponent(spec.componentName);
    const vm = new Vue({
      store,
      render: (h) => h(component, { props: spec.props }),
    });
    vm.$mount(`#${spec.id}`);
  }
} else {
  console.log('render entire app');
}
