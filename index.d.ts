/**
 * Surrogates are used to contain data that is needed to inject Vue html
 * into another html string.
 */
interface Surrogate {
  id: string;
  placeholder: string;
  componentName: string;
  props: object;
  html: string;
}

/**
 * HydrationSpecs have a subset of data that Surrogates have. They have
 * data needed by a client to hydrate a component.
 */
interface HydrationSpec {
  id: string;
  componentName: string;
  props: object;
}
