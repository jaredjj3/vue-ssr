import 'es6-promise/auto';
import Vue from 'vue';
import createStore from './store/createStore';
import getComponent from './components/getComponent';
import createApp from './app/createApp';

/**
 * @param {object} store
 * @return {void}
 */
const syncStoreState = (store) => {
  if (window.hasOwnProperty('__INITIAL_STATE__')) {
    store.replaceState(window.__INITIAL_STATE__);
  }
};

/**
 * @param {object} store
 * @param {HydrationSpec} hydrationSpec
 * @return {Vue}
 */
const createVueInstance = (store, hydrationSpec) => {
  const component = getComponent(hydrationSpec.componentName);
  return new Vue({
    store,
    render: (h) => h(component, { props: hydrationSpec.props || {} }),
  });
};

// The presence of __HYDRATION_SPECS__ indicates that the server
// used a mustache template and injected Vue components into the
// already-rendered html.
if (window.hasOwnProperty('__HYDRATION_SPECS__')) {
  const store = createStore();
  syncStoreState(store);
  for (const hydrationSpec of window.__HYDRATION_SPECS__) {
    const vm = createVueInstance(store, hydrationSpec);
    vm.$mount(`#${hydrationSpec.id}`);
  }
} else {
  const { app, store, router } = createApp();
  syncStoreState(store);
  router.onReady(() => {
    app.$mount('#app');
  });
}
