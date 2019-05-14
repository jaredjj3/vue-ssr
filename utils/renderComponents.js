const { createBundleRenderer } = require('vue-server-renderer');
const createHydrationSpec = require('./createHydrationSpec');

/**
 * @param {Component} component
 * @return {boolean}
 */
const isAssetsComponent = (component) => {
  return component.componentName === 'Assets';
};

/**
 * Creates an array of hydration specs, which are sent to the client to
 * instruct it how to hydrate each component. If a component is an
 * assets component, it is skipped since it isn't valid to hydrate it.
 *
 * @param {Component[]} components
 * @return {HydrationSpec[]}
 */
const getHydrationSpecs = (components) => {
  const hydrationSpecs = [];
  for (const component of components) {
    if (!isAssetsComponent(component)) {
      const hydrationSpec = createHydrationSpec(component);
      hydrationSpecs.push(hydrationSpec);
    }
  }
  return hydrationSpecs;
};

/**
 * In order to manually inject assets, the context state must be set, then
 * context.renderState() must be called. The purpose of this function is
 * to abstract this complexity away and to ensure the context.state attribute
 * is unchanged.
 *
 * See https://ssr.vuejs.org/api/#template and
 * https://ssr.vuejs.org/guide/build-config.html#manual-asset-injection for
 * more information.
 *
 * @param {object} context
 * @param {string} windowKey
 * @param {any} state
 * @return {string}
 */
const renderState = (context, windowKey, state) => {
  const tmp = context.state;
  context.state = state;
  const script = context.renderState({ windowKey });
  context.state = tmp;
  return script;
};

/**
 * Returns a function that can be used in the createBundleRenderer template
 * options object. This template includes the scripts needed to properly
 * render the assets component. This template should only be used for the
 * assets template.
 *
 * @param {Component[]} components
 * @param {function} getStore
 * @return {function}
 */
const getAssetsTemplate = (components, getStore) => (_html, context) => {
  const windowInitialStateScript = renderState(
      context,
      '__INITIAL_STATE__',
      getStore().state
  );

  const windowHydrationSpecsScript = renderState(
      context,
      '__HYDRATION_SPECS__',
      getHydrationSpecs(components)
  );

  const clientBundleScripts = context.renderScripts();

  return [
    windowInitialStateScript,
    windowHydrationSpecsScript,
    clientBundleScripts,
  ].join('\n');
};

/**
 * The purpose of this function is to populate the html attribute in-place
 * of the components argument.
 *
 * @param {ServerBundle} bundle
 * @param {ClientManifest} clientManifest
 * @param {Component[]} components
 * @return {Promise<void>}
 */
module.exports = (bundle, clientManifest, components) => {
  // This stateful function is used to only create the store once
  // It can be called with or without a createStore function
  const getStore = (() => {
    let store;
    const noop = () => undefined;
    return (createStore = noop) => {
      store = store || createStore();
      return store;
    };
  })();

  // Populate the renderPromises array
  const renderPromises = [];
  for (const component of components) {
    let template; // ok to be undefined
    if (isAssetsComponent(component)) {
      template = getAssetsTemplate(components, getStore);
    }
    const renderer = createBundleRenderer(bundle, {
      clientManifest,
      template,
    });
    const context = {
      ...component,
      getStore,
      isPage: false,
    };
    const renderPromise = renderer.renderToString(context).then((html) => {
      component.html = html;
    });
    renderPromises.push(renderPromise);
  }

  return Promise.all(renderPromises);
};
