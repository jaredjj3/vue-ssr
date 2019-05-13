const { createBundleRenderer } = require('vue-server-renderer');
const createHydrationSpec = require('./createHydrationSpec');

const isAssetsComponent = (component) => {
  return component.componentName === 'Assets';
};

const getAssetsTemplate = (components, getStore) => (html, context) => {
  const hydrationSpecs = [];
  for (const component of components) {
    if (!isAssetsComponent(component)) {
      const hydrationSpec = createHydrationSpec(component);
      hydrationSpecs.push(hydrationSpec);
    }
  }

  context.state = getStore().state;
  const wInitialState = context.renderState({
    windowKey: '__INITIAL_STATE__',
  });

  context.state = hydrationSpecs;
  const wHydrationSpecs = context.renderState({
    windowKey: '__HYDRATION_SPECS__',
  });

  const scripts = context.renderScripts();

  const styles = context.renderStyles();

  return [
    wInitialState,
    wHydrationSpecs,
    scripts,
    styles,
  ].join('\n');
};

module.exports = (bundle, clientManifest, components) => {
  const renders = [];

  // callback
  const f = () => {
    let store;
    return (createStore) => {
      store = store || createStore();
      return store;
    };
  };
  const getStore = f();

  for (const component of components) {
    const template = isAssetsComponent(component)
      ? getAssetsTemplate(components, getStore)
      : undefined;

    const renderer = createBundleRenderer(bundle, {
      clientManifest,
      template,
    });

    const context = {
      ...component,
      getStore,
    };
    const renderPromise = renderer.renderToString(context).then((html) => {
      component.html = html;
    });

    renders.push(renderPromise);
  }

  return renders;
};
