import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// route-level code splitting
const FooPage = () => import('../pages/FooPage.vue');
const BarPage = () => import('../pages/BarPage.vue');
const BazPage = () => import('../pages/BazPage.vue');

export default () => {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      { path: '/', redirect: '/foo' },
      { path: '/foo', component: FooPage },
      { path: '/bar', component: BarPage },
      { path: '/baz', component: BazPage },
    ],
  });
};
