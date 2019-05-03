import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// route-level code splitting
// const FooView = () => import('../views/FooView.vue');
// const BarView = () => import('../views/BarView.vue');
// const BazView = () => import('../views/BazView.vue');

export const createRouter = () => {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({y: 0}),
    routes: [
      {path: '/foo', component: FooView},
      {path: '/bar', component: BarView},
      {path: '/baz', component: BazView},
    ],
  });
};
